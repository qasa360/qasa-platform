export const AUDIT_TYPES = {
  IAuditRepository: Symbol.for("IAuditRepository"),
  IInitAuditService: Symbol.for("IInitAuditService"),
  IAnswerQuestionService: Symbol.for("IAnswerQuestionService"),
  ICompleteAuditService: Symbol.for("ICompleteAuditService"),
  IGetAuditService: Symbol.for("IGetAuditService"),
  IUploadPhotosService: Symbol.for("IUploadPhotosService"),
  IAutoIncidenceGeneratorService: Symbol.for("IAutoIncidenceGeneratorService"),
  IFollowupQuestionService: Symbol.for("IFollowupQuestionService"),
} as const;
