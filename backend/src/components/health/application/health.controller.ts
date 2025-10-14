import { constants } from "http2";
import { inject } from "inversify";
import type { Request, Response } from "express";
import {
  BaseHttpController,
  controller,
  httpGet,
} from "inversify-express-utils";
import type { HealthService } from "../domain/healthService.interface";
import { HEALTH_TYPES } from "../types";

@controller("/health")
export class HealthController extends BaseHttpController {
  constructor(
    @inject(HEALTH_TYPES.HealthService)
    private readonly healthService: HealthService
  ) {
    super();
  }

  @httpGet("/")
  public async getHealth(_req: Request, res: Response): Promise<void> {
    const status = await this.healthService.check();
    res.status(constants.HTTP_STATUS_OK).json(status);
  }
}
