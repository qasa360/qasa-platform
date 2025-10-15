import StatsD from "hot-shots";
import { injectable } from "inversify";
import { appConfig } from "../../config/appConfig";
import type { IMetrics } from "./metrics.interface";

@injectable()
export class ConsoleMetrics implements IMetrics {
  #statsd = new StatsD({
    host: appConfig.statsd.host,
    port: appConfig.statsd.port,
    globalTags: { env: appConfig.isProduction ? "production" : "development" },
    prefix: appConfig.appName,
    telegraf: true,
  });

  increment(metric: string, tags?: string[]): void {
    this.#statsd.increment(metric, 1, tags);
  }
  decrement(metric: string, tags?: string[]): void {
    this.#statsd.decrement(metric, 1, tags);
  }
  gauge(metric: string, value: number, tags?: string[]): void {
    this.#statsd.gauge(metric, value, tags);
  }
  histogram(metric: string, value: number, tags?: string[]): void {
    this.#statsd.histogram(metric, value, tags);
  }
  timing(metric: string, value: number, tags?: string[]): void {
    this.#statsd.timing(metric, value, tags);
  }
  set(metric: string, value: number, tags?: string[]): void {
    this.#statsd.set(metric, value, tags);
  }
  close(): void {
    this.#statsd.close();
  }
}
