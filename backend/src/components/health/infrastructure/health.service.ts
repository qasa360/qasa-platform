import { injectable } from 'inversify';
import type { HealthStatus } from '../domain/healthStatus';
import type { HealthService } from '../domain/healthService.interface';

@injectable()
export class DefaultHealthService implements HealthService {
  async check(): Promise<HealthStatus> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptimeInSeconds: Math.floor(process.uptime())
    };
  }
}
