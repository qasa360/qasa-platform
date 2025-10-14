import type { HealthStatus } from "./healthStatus";

export interface IHealthService {
  check(): Promise<HealthStatus>;
}
