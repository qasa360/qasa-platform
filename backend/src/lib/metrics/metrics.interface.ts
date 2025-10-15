export interface IMetrics {
  increment(metric: string, tags?: string[]): void;
  gauge(metric: string, value: number, tags?: string[]): void;
  histogram(metric: string, value: number, tags?: string[]): void;
}
