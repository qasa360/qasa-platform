import { inject, injectable } from "inversify";
import { INFRASTRUCTURE_TYPES } from "../../../dependencies/types";
import { AppError } from "../../../core/errors/AppError";
import { AUDIT_TYPES } from "../types";
import { AUDIT_TEMPLATE_TYPES } from "../../auditTemplates/types";
import { APARTMENT_TYPES } from "../../apartments/types";
import { AuditStatus } from "../models/AuditStatus";
import { Audit } from "../models/Audit";
import { AuditItem } from "../models/AuditItem";
import type { AuditQuestionTemplate } from "../../auditTemplates/models/AuditQuestionTemplate";
import type { IAuditRepository } from "../repository/audit.repository.interface";
import type { IAuditTemplateService } from "../../auditTemplates/services/auditTemplate.service.interface";
import type { IApartmentService } from "../../apartments/services/apartment.service.interface";
import type { IPrismaCustomClient } from "../../../infrastructure/prisma/IPrismaCustomClient";
import { Transactional } from "../../../infrastructure/prisma/TransactionalPrisma";
import type { IInitAuditService } from "./initAudit.service.interface";

@injectable()
export class InitAuditService implements IInitAuditService {
  public prismaCustomClient: IPrismaCustomClient;

  constructor(
    @inject(AUDIT_TYPES.IAuditRepository)
    private readonly auditRepository: IAuditRepository,
    @inject(AUDIT_TEMPLATE_TYPES.IAuditTemplateService)
    private readonly templateService: IAuditTemplateService,
    @inject(APARTMENT_TYPES.IApartmentService)
    private readonly apartmentService: IApartmentService,
    @inject(INFRASTRUCTURE_TYPES.IPrismaCustomClient)
    prismaCustomClient: IPrismaCustomClient
  ) {
    this.prismaCustomClient = prismaCustomClient;
  }

  @Transactional
  async startAudit(data: {
    apartmentId: number;
    auditTemplateVersionId?: number;
    createdBy?: string;
  }): Promise<Audit> {
    // Check if there's already an audit in progress for this apartment
    const existingAudit =
      await this.auditRepository.getActiveAuditByApartmentId(data.apartmentId);

    if (existingAudit) {
      const error = new AppError({
        origin: "InitAuditService",
        name: "AuditAlreadyInProgressError",
        message: `An audit is already in progress for apartment ${data.apartmentId}`,
        httpCode: 409,
        logWarning: true,
      });
      // Attach audit ID to error for frontend redirection
      (error as any).auditId = existingAudit.id;
      throw error;
    }

    // Get default template version if not provided
    let templateVersionId = data.auditTemplateVersionId;
    if (!templateVersionId) {
      const defaultTemplate =
        await this.templateService.getDefaultTemplateVersion();
      templateVersionId = defaultTemplate.id;
    }

    if (!templateVersionId) {
      throw new AppError({
        origin: "InitAuditService",
        name: "TemplateVersionNotFoundError",
        message: "Template version not found",
        httpCode: 404,
      });
    }

    // Verify apartment exists
    const apartment =
      await this.apartmentService.getApartmentWithSpacesAndElements(
        data.apartmentId
      );

    if (!apartment) {
      throw new AppError({
        origin: "InitAuditService",
        name: "ApartmentNotFoundError",
        message: `Apartment with id ${data.apartmentId} not found`,
        httpCode: 404,
      });
    }

    // Create audit entity
    const audit = new Audit({
      id: null,
      uuid: null,
      apartmentId: data.apartmentId,
      auditTemplateVersionId: templateVersionId!,
      status: AuditStatus.DRAFT,
      completionRate: 0,
      createdAt: null,
      updatedAt: null,
      createdBy: data.createdBy,
    });

    // Save audit to get ID
    const savedAudit = await this.auditRepository.saveAudit(audit);

    // Get all questions from template
    const questions =
      await this.templateService.getQuestionsByTemplateVersion(
        templateVersionId
      );

    // Create audit items entities for each question
    const auditItems: AuditItem[] = [];

    // Process apartment-level questions
    for (const question of questions.filter(
      (q: AuditQuestionTemplate) => q.targetType === "APARTMENT"
    )) {
      auditItems.push(
        new AuditItem({
          id: null,
          uuid: null,
          auditId: savedAudit.id!,
          questionTemplateId: question.id,
          targetType: question.targetType,
          apartmentId: data.apartmentId,
          questionText: question.questionText,
          answerType: question.answerType,
          category: question.category,
          weight: question.weight ?? undefined,
          impact: question.impact,
          isMandatory: question.isMandatory,
          sortOrder: question.sortOrder ?? undefined,
          isAnswered: false,
          isVisible: true,
          completionRate: 0,
          createdAt: null,
          updatedAt: null,
        })
      );
    }

    // Process space-level questions
    for (const space of apartment.spaces) {
      for (const question of questions.filter(
        (q: AuditQuestionTemplate) =>
          q.targetType === "SPACE" && q.spaceTypeId === space.spaceTypeId
      )) {
        auditItems.push(
          new AuditItem({
            id: null,
            uuid: null,
            auditId: savedAudit.id!,
            questionTemplateId: question.id,
            targetType: question.targetType,
            apartmentId: data.apartmentId,
            spaceId: space.id,
            questionText: question.questionText,
            answerType: question.answerType,
            category: question.category,
            weight: question.weight ?? undefined,
            impact: question.impact,
            isMandatory: question.isMandatory,
            sortOrder: question.sortOrder ?? undefined,
            isAnswered: false,
            isVisible: true,
            completionRate: 0,
            createdAt: null,
            updatedAt: null,
          })
        );
      }

      // Process element-level questions
      for (const element of space.elements) {
        for (const question of questions.filter(
          (q: AuditQuestionTemplate) =>
            q.targetType === "ELEMENT" &&
            q.elementTypeId === element.elementTypeId
        )) {
          auditItems.push(
            new AuditItem({
              id: null,
              uuid: null,
              auditId: savedAudit.id!,
              questionTemplateId: question.id,
              targetType: question.targetType,
              apartmentId: data.apartmentId,
              spaceId: space.id,
              elementId: element.id,
              questionText: question.questionText,
              answerType: question.answerType,
              category: question.category,
              weight: question.weight ?? undefined,
              impact: question.impact,
              isMandatory: question.isMandatory,
              sortOrder: question.sortOrder ?? undefined,
              isAnswered: false,
              isVisible: true,
              completionRate: 0,
              createdAt: null,
              updatedAt: null,
            })
          );
        }
      }
    }

    if (auditItems.length === 0) {
      throw new AppError({
        origin: "InitAuditService",
        name: "NoQuestionsError",
        message: "No questions found for this apartment",
        httpCode: 400,
      });
    }

    // Save all audit items
    await this.auditRepository.saveAuditItems(auditItems);

    // Start audit (change status to IN_PROGRESS)
    return this.auditRepository.updateAuditStatus(
      savedAudit.id!,
      AuditStatus.IN_PROGRESS,
      data.createdBy ?? "system"
    );
  }
}
