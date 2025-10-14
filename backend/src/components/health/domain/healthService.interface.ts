import type { HealthStatus } from './healthStatus';

export interface HealthService {
  check(): Promise<HealthStatus>;
}
