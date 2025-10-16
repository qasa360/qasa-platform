import { injectable } from "inversify";
import type { HealthStatus } from "../domain/healthStatus";
import type { IHealthService } from "../domain/healthService.interface";

@injectable()
export class DefaultHealthService implements IHealthService {
  async check(): Promise<HealthStatus> {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptimeInSeconds: Math.floor(process.uptime()),
    };
  }
}
