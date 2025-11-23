import { inject, injectable } from "inversify";
import { INFRASTRUCTURE_TYPES } from "../../../dependencies/types";
import { AppError } from "../../../core/errors/AppError";
import { AUDIT_TYPES } from "../types";
import { AuditPhotoContext, AuditPhoto } from "../models/AuditPhoto";
import { AuditResponse } from "../models/AuditResponse";
import type { IAuditRepository } from "../repository/audit.repository.interface";
import type { IPrismaCustomClient } from "../../../infrastructure/prisma/IPrismaCustomClient";
import { Transactional } from "../../../infrastructure/prisma/TransactionalPrisma";
import type { IAutoIncidenceGeneratorService } from "./autoIncidenceGenerator.service.interface";
import type { IFollowupQuestionService } from "./followupQuestion.service.interface";
import type { IAnswerQuestionService } from "./answerQuestion.service.interface";

@injectable()
export class AnswerQuestionService implements IAnswerQuestionService {
  public prismaCustomClient: IPrismaCustomClient;

  constructor(
    @inject(AUDIT_TYPES.IAuditRepository)
    private readonly auditRepository: IAuditRepository,
    @inject(AUDIT_TYPES.IAutoIncidenceGeneratorService)
    private readonly autoIncidenceGenerator: IAutoIncidenceGeneratorService,
    @inject(AUDIT_TYPES.IFollowupQuestionService)
    private readonly followupQuestionService: IFollowupQuestionService,
    @inject(INFRASTRUCTURE_TYPES.IPrismaCustomClient)
    prismaCustomClient: IPrismaCustomClient
  ) {
    this.prismaCustomClient = prismaCustomClient;
  }

  @Transactional
  async answerQuestion(data: {
    auditId: number;
    auditItemId: number;
    booleanValue?: boolean;
    textValue?: string;
    numberValue?: number;
    selectedOptionIds?: number[];
    notes?: string;
    photos?: Array<{
      url: string;
      description?: string;
      metadata?: Record<string, unknown>;
    }>;
    createdBy?: string;
  }): Promise<AuditResponse> {
    // Verify audit exists and is in progress
    const audit = await this.auditRepository.getAuditById(data.auditId);
    if (!audit) {
      throw new AppError({
        origin: "AnswerQuestionService",
        name: "AuditNotFoundError",
        message: `Audit with id ${data.auditId} not found`,
        httpCode: 404,
      });
    }

    if (!audit.canComplete()) {
      throw new AppError({
        origin: "AnswerQuestionService",
        name: "InvalidAuditStatusError",
        message: `Cannot answer questions for audit in status ${audit.status}`,
        httpCode: 400,
      });
    }

    // Get audit item (cache for later use)
    const items = await this.auditRepository.getAuditItemsByAuditId(
      data.auditId
    );
    const item = items.find((i) => i.id === data.auditItemId);

    if (!item) {
      throw new AppError({
        origin: "AnswerQuestionService",
        name: "AuditItemNotFoundError",
        message: `Audit item with id ${data.auditItemId} not found`,
        httpCode: 404,
      });
    }

    // Check if response already exists
    const existingResponse =
      item.answers && item.answers.length > 0 ? item.answers[0] : null;

    let savedResponse: AuditResponse;

    if (existingResponse) {
      // Update existing response
      const client = this.prismaCustomClient.client;

      // Update the response
      await client.auditResponse.update({
        where: { id: existingResponse.id! },
        data: {
          boolean_value: data.booleanValue,
          text_value: data.textValue,
          number_value: data.numberValue,
          notes: data.notes,
          completed_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Delete existing response options
      await client.auditResponseOption.deleteMany({
        where: { audit_response_id: existingResponse.id! },
      });

      const updatedResponse = await this.auditRepository.getAuditResponseById(
        existingResponse.id!
      );

      if (!updatedResponse) {
        throw new AppError({
          origin: "AnswerQuestionService",
          name: "ResponseNotFoundError",
          message: `Response with id ${existingResponse.id} not found after update`,
          httpCode: 404,
        });
      }

      savedResponse = updatedResponse;
    } else {
      // Create new response entity
      const response = new AuditResponse({
        id: null,
        auditItemId: data.auditItemId,
        booleanValue: data.booleanValue,
        textValue: data.textValue,
        numberValue: data.numberValue,
        notes: data.notes,
        startedAt: item.startedAt ?? new Date(),
        completedAt: new Date(),
        createdAt: null,
        updatedAt: null,
      });

      // Save new response
      savedResponse = await this.auditRepository.saveAuditResponse(response);
    }

    // Create response options if provided
    if (data.selectedOptionIds && data.selectedOptionIds.length > 0) {
      await this.auditRepository.createAuditResponseOptions(
        savedResponse.id!,
        data.selectedOptionIds
      );

      // Generate auto-incidences
      await this.autoIncidenceGenerator.generateIncidencesForResponse({
        auditId: data.auditId,
        auditItemId: data.auditItemId,
        targetType: item.targetType,
        apartmentId: item.apartmentId,
        spaceId: item.spaceId,
        elementId: item.elementId,
        selectedOptionIds: data.selectedOptionIds,
        createdBy: data.createdBy,
      });

      // Generate follow-up questions
      await this.followupQuestionService.generateFollowupQuestions({
        auditId: data.auditId,
        parentAuditItemId: data.auditItemId,
        targetType: item.targetType,
        apartmentId: item.apartmentId,
        spaceId: item.spaceId,
        elementId: item.elementId,
        selectedOptionIds: data.selectedOptionIds,
      });
    }

    // Upload photos if provided
    if (data.photos && data.photos.length > 0) {
      // If updating, delete old photos first (optional - you might want to keep them)
      if (existingResponse) {
        const client = this.prismaCustomClient.client;
        await client.auditPhoto.deleteMany({
          where: { audit_response_id: savedResponse.id! },
        });
      }

      const photoEntities = data.photos.map(
        (photo) =>
          new AuditPhoto({
            id: null,
            uuid: null,
            auditId: data.auditId,
            context: AuditPhotoContext.RESPONSE,
            url: photo.url,
            description: photo.description,
            metadata: photo.metadata,
            auditItemId: data.auditItemId,
            auditResponseId: savedResponse.id!,
            createdBy: data.createdBy,
            createdAt: null,
          })
      );

      await this.auditRepository.saveAuditPhotos(photoEntities);
    }

    // Update completion rate (reuse cached items, but fetch fresh to get updated isAnswered status)
    const updatedItems = await this.auditRepository.getAuditItemsByAuditId(
      data.auditId
    );
    const answeredCount = updatedItems.filter((i) => i.isAnswered).length;
    const completionRate = (answeredCount / updatedItems.length) * 100;

    await this.auditRepository.updateAuditCompletionRate(
      data.auditId,
      completionRate
    );

    // Return updated response with relations
    const updatedResponse = await this.auditRepository.getAuditResponseById(
      savedResponse.id!
    );

    if (!updatedResponse) {
      throw new AppError({
        origin: "AnswerQuestionService",
        name: "ResponseNotFoundError",
        message: `Response with id ${savedResponse.id} not found`,
        httpCode: 404,
      });
    }

    return updatedResponse;
  }
}
