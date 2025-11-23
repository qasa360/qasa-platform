import { ContainerModule } from "inversify";
import { AUDIT_TEMPLATE_TYPES } from "./types";
import type { IAuditTemplateRepository } from "./repository/auditTemplate.repository.interface";
import { AuditTemplateRepository } from "./repository/auditTemplate.repository";
import type { IAuditTemplateService } from "./services/auditTemplate.service.interface";
import { AuditTemplateService } from "./services/auditTemplate.service";

export const AuditTemplateComponent = new ContainerModule((bind) => {
  bind<IAuditTemplateRepository>(AUDIT_TEMPLATE_TYPES.IAuditTemplateRepository)
    .to(AuditTemplateRepository)
    .inSingletonScope();
  bind<IAuditTemplateService>(AUDIT_TEMPLATE_TYPES.IAuditTemplateService)
    .to(AuditTemplateService)
    .inSingletonScope();
});
