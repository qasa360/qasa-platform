import { injectable } from "inversify";
import type { IMetrics } from "./metrics.interface";

@injectable()
export class ConsoleMetrics implements IMetrics {
  increment(metric: string, tags?: string[]): void {
    console.log(`[METRIC] INCREMENT ${metric}`, tags);
  }

  gauge(metric: string, value: number, tags?: string[]): void {
    console.log(`[METRIC] GAUGE ${metric}=${value}`, tags);
  }

  histogram(metric: string, value: number, tags?: string[]): void {
    console.log(`[METRIC] HISTOGRAM ${metric}=${value}`, tags);
  }
}
