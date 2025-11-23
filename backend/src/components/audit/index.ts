import { ContainerModule } from "inversify";
import { AUDIT_TYPES } from "./types";
import type { IAuditRepository } from "./repository/audit.repository.interface";
import { AuditRepository } from "./repository/audit.repository";
import type { IInitAuditService } from "./services/initAudit.service.interface";
import { InitAuditService } from "./services/initAudit.service";
import type { IAnswerQuestionService } from "./services/answerQuestion.service.interface";
import { AnswerQuestionService } from "./services/answerQuestion.service";
import type { ICompleteAuditService } from "./services/completeAudit.service.interface";
import { CompleteAuditService } from "./services/completeAudit.service";
import type { IGetAuditService } from "./services/getAudit.service.interface";
import { GetAuditService } from "./services/getAudit.service";
import type { IUploadPhotosService } from "./services/uploadPhotos.service.interface";
import { UploadPhotosService } from "./services/uploadPhotos.service";
import type { IAutoIncidenceGeneratorService } from "./services/autoIncidenceGenerator.service.interface";
import { AutoIncidenceGeneratorService } from "./services/autoIncidenceGenerator.service";
import type { IFollowupQuestionService } from "./services/followupQuestion.service.interface";
import { FollowupQuestionService } from "./services/followupQuestion.service";
import { AuditController } from "./audit.controller";

export const AuditComponent = new ContainerModule((bind) => {
  bind(AuditController).toSelf();
  bind<IAuditRepository>(AUDIT_TYPES.IAuditRepository)
    .to(AuditRepository)
    .inSingletonScope();
  bind<IInitAuditService>(AUDIT_TYPES.IInitAuditService)
    .to(InitAuditService)
    .inSingletonScope();
  bind<IAnswerQuestionService>(AUDIT_TYPES.IAnswerQuestionService)
    .to(AnswerQuestionService)
    .inSingletonScope();
  bind<ICompleteAuditService>(AUDIT_TYPES.ICompleteAuditService)
    .to(CompleteAuditService)
    .inSingletonScope();
  bind<IGetAuditService>(AUDIT_TYPES.IGetAuditService)
    .to(GetAuditService)
    .inSingletonScope();
  bind<IUploadPhotosService>(AUDIT_TYPES.IUploadPhotosService)
    .to(UploadPhotosService)
    .inSingletonScope();
  bind<IAutoIncidenceGeneratorService>(
    AUDIT_TYPES.IAutoIncidenceGeneratorService
  )
    .to(AutoIncidenceGeneratorService)
    .inSingletonScope();
  bind<IFollowupQuestionService>(AUDIT_TYPES.IFollowupQuestionService)
    .to(FollowupQuestionService)
    .inSingletonScope();
});
