import type { Request, Response, NextFunction } from "express";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  httpPut,
} from "inversify-express-utils";
import { ensureAuthenticated } from "../../core/middlewares/ensureAuthenticated";
import { upload } from "../../core/middlewares/multerUpload";
import { AppError } from "../../core/errors/AppError";
import type { IInitAuditService } from "./services/init-audit.service.interface";
import type { IAnswerQuestionService } from "./services/answerQuestion.service.interface";
import type { ICompleteAuditService } from "./services/completeAudit.service.interface";
import type { IGetAuditService } from "./services/getAudit.service.interface";
import type { IUploadPhotosService } from "./services/uploadPhotos.service.interface";
import { AUDIT_TYPES } from "./types";
import type { AuditItem } from "./models/AuditItem";

@controller("/audits")
export class AuditController extends BaseHttpController {
  constructor(
    @inject(AUDIT_TYPES.IInitAuditService)
    private readonly initAuditService: IInitAuditService,
    @inject(AUDIT_TYPES.IAnswerQuestionService)
    private readonly answerQuestionService: IAnswerQuestionService,
    @inject(AUDIT_TYPES.ICompleteAuditService)
    private readonly completeAuditService: ICompleteAuditService,
    @inject(AUDIT_TYPES.IGetAuditService)
    private readonly getAuditService: IGetAuditService,
    @inject(AUDIT_TYPES.IUploadPhotosService)
    private readonly uploadPhotosService: IUploadPhotosService
  ) {
    super();
  }

  @httpPost("/", ensureAuthenticated)
  async startAudit(req: Request, res: Response, next: NextFunction) {
    try {
      const { apartmentId, auditTemplateVersionId } = req.body;
      const agent = req.agent;

      if (!apartmentId) {
        return next(
          new AppError({
            origin: "AuditController",
            name: "MissingApartmentIdError",
            message: "apartmentId is required",
            httpCode: 400,
          })
        );
      }

      const audit = await this.initAuditService.startAudit({
        apartmentId: parseInt(apartmentId),
        auditTemplateVersionId: auditTemplateVersionId
          ? parseInt(auditTemplateVersionId)
          : undefined,
        createdBy: agent,
      });

      return res.status(201).json(audit.toJSON());
    } catch (error) {
      next(error);
    }
  }

  @httpGet("/", ensureAuthenticated)
  async getActiveAuditByApartment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const apartmentId = req.query.apartmentId;

      if (!apartmentId) {
        return next(
          new AppError({
            origin: "AuditController",
            name: "MissingApartmentIdError",
            message: "apartmentId query parameter is required",
            httpCode: 400,
          })
        );
      }

      const apartmentIdNum = parseInt(apartmentId as string);

      if (isNaN(apartmentIdNum)) {
        return next(
          new AppError({
            origin: "AuditController",
            name: "InvalidApartmentIdError",
            message: "Invalid apartment ID. Must be a number.",
            httpCode: 400,
          })
        );
      }

      // Get active audit (IN_PROGRESS) for this apartment
      const audit =
        await this.getAuditService.getActiveAuditByApartmentId(apartmentIdNum);

      if (!audit) {
        return res.status(200).json(null);
      }

      return res.status(200).json(audit.toJSON());
    } catch (error) {
      next(error);
    }
  }

  @httpGet("/:id", ensureAuthenticated)
  async getAuditById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return next(
          new AppError({
            origin: "AuditController",
            name: "InvalidAuditIdError",
            message: "Invalid audit ID. Must be a number.",
            httpCode: 400,
          })
        );
      }

      const audit = await this.getAuditService.getAuditById(id);

      if (!audit) {
        return next(
          new AppError({
            origin: "AuditController",
            name: "AuditNotFoundError",
            message: `Audit with id ${id} not found`,
            httpCode: 404,
          })
        );
      }

      return res.status(200).json(audit.toJSON());
    } catch (error) {
      next(error);
    }
  }

  @httpGet("/uuid/:uuid", ensureAuthenticated)
  async getAuditByUuid(req: Request, res: Response, next: NextFunction) {
    try {
      const { uuid } = req.params;

      if (!uuid) {
        return next(
          new AppError({
            origin: "AuditController",
            name: "MissingUuidError",
            message: "UUID is required",
            httpCode: 400,
          })
        );
      }

      const audit = await this.getAuditService.getAuditByUuid(uuid);

      if (!audit) {
        return next(
          new AppError({
            origin: "AuditController",
            name: "AuditNotFoundError",
            message: `Audit with uuid ${uuid} not found`,
            httpCode: 404,
          })
        );
      }

      return res.status(200).json(audit.toJSON());
    } catch (error) {
      next(error);
    }
  }

  @httpGet("/:id/items", ensureAuthenticated)
  async getAuditItems(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return next(
          new AppError({
            origin: "AuditController",
            name: "InvalidAuditIdError",
            message: "Invalid audit ID. Must be a number.",
            httpCode: 400,
          })
        );
      }

      const items = await this.getAuditService.getAuditItems(id);

      return res
        .status(200)
        .json(items.map((item: AuditItem) => item.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  @httpPost("/:id/answer", ensureAuthenticated)
  async answerQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const auditId = parseInt(req.params.id);
      const agent = req.agent;
      const {
        auditItemId,
        booleanValue,
        textValue,
        numberValue,
        selectedOptionIds,
        notes,
        photos,
      } = req.body;

      if (isNaN(auditId)) {
        return next(
          new AppError({
            origin: "AuditController",
            name: "InvalidAuditIdError",
            message: "Invalid audit ID. Must be a number.",
            httpCode: 400,
          })
        );
      }

      if (!auditItemId) {
        return next(
          new AppError({
            origin: "AuditController",
            name: "MissingAuditItemIdError",
            message: "auditItemId is required",
            httpCode: 400,
          })
        );
      }

      const response = await this.answerQuestionService.answerQuestion({
        auditId,
        auditItemId: parseInt(auditItemId),
        booleanValue,
        textValue,
        numberValue: numberValue ? parseFloat(numberValue) : undefined,
        selectedOptionIds: selectedOptionIds?.map((id: string | number) =>
          parseInt(String(id))
        ),
        notes,
        photos,
        createdBy: agent,
      });

      return res.status(201).json(response.toJSON());
    } catch (error) {
      next(error);
    }
  }

  @httpPost("/:id/photos", ensureAuthenticated, upload.array("photos", 10))
  async uploadPhotos(req: Request, res: Response, next: NextFunction) {
    try {
      const auditId = parseInt(req.params.id);
      const agent = req.agent;
      const files = req.files as Express.Multer.File[] | undefined;
      const {
        context,
        description,
        spaceId,
        elementId,
        auditItemId,
        auditResponseId,
        auditIncidenceId,
      } = req.body;

      if (isNaN(auditId)) {
        return next(
          new AppError({
            origin: "AuditController",
            name: "InvalidAuditIdError",
            message: "Invalid audit ID. Must be a number.",
            httpCode: 400,
          })
        );
      }

      if (!files || files.length === 0) {
        return next(
          new AppError({
            origin: "AuditController",
            name: "MissingPhotosError",
            message: "At least one photo file is required",
            httpCode: 400,
          })
        );
      }

      if (!context) {
        return next(
          new AppError({
            origin: "AuditController",
            name: "MissingContextError",
            message:
              "context is required (RESPONSE, ELEMENT, SPACE, INCIDENCE)",
            httpCode: 400,
          })
        );
      }

      const uploadedPhotos = await this.uploadPhotosService.uploadPhotos({
        auditId,
        files: files.map((file) => ({
          buffer: file.buffer,
          originalName: file.originalname,
          mimetype: file.mimetype,
        })),
        context,
        description,
        spaceId: spaceId ? parseInt(spaceId) : undefined,
        elementId: elementId ? parseInt(elementId) : undefined,
        auditItemId: auditItemId ? parseInt(auditItemId) : undefined,
        auditResponseId: auditResponseId
          ? parseInt(auditResponseId)
          : undefined,
        auditIncidenceId: auditIncidenceId
          ? parseInt(auditIncidenceId)
          : undefined,
        createdBy: agent,
      });

      return res.status(201).json(uploadedPhotos.map((p) => p.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  @httpPut("/:id/complete", ensureAuthenticated)
  async completeAudit(req: Request, res: Response, next: NextFunction) {
    try {
      const auditId = parseInt(req.params.id);
      const agent = req.agent;

      if (isNaN(auditId)) {
        return next(
          new AppError({
            origin: "AuditController",
            name: "InvalidAuditIdError",
            message: "Invalid audit ID. Must be a number.",
            httpCode: 400,
          })
        );
      }

      const audit = await this.completeAuditService.completeAudit({
        auditId,
        completedBy: agent,
      });

      return res.status(200).json(audit.toJSON());
    } catch (error) {
      next(error);
    }
  }
}
