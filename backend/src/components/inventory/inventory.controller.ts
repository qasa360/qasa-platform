import type { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpGet,
} from "inversify-express-utils";
import { AppError } from "../../core/errors/AppError";
import { ensureAuthenticated } from "../../core/middlewares/ensureAuthenticated";
import type { IInventoryService } from "./services/inventory.service.interface";
import { INVENTORY_TYPES } from "./types";

@controller("/inventory")
export class ElementController extends BaseHttpController {
  constructor(
    @inject(INVENTORY_TYPES.IInventoryService)
    private readonly inventoryService: IInventoryService
  ) {
    super();
  }

  @httpGet("/:spaceId", ensureAuthenticated)
  async getInventoryBySpaceId(req: Request, res: Response, next: NextFunction) {
    const spaceId = parseInt(req.params.spaceId);

    if (isNaN(spaceId)) {
      next(
        new AppError({
          origin: "InventoryController",
          name: "InvalidSpaceIdError",
          message: "Invalid space ID. Must be a number.",
          httpCode: 400,
        })
      );
    }

    try {
      const elements =
        await this.inventoryService.getInventoryBySpaceId(spaceId);
      return res.status(200).json(elements);
    } catch (error) {
      next(error);
    }
  }
}
