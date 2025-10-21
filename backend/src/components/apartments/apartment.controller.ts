import type { Request, Response } from "express";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpGet,
} from "inversify-express-utils";
import { ensureAuthenticated } from "../../core/middlewares/ensureAuthenticated";
import type { IApartmentService } from "./services/apartment.service.interface";
import { APARTMENT_TYPES } from "./types";

@controller("/apartments")
export class ApartmentController extends BaseHttpController {
  constructor(
    @inject(APARTMENT_TYPES.IApartmentService)
    private readonly apartmentService: IApartmentService
  ) {
    super();
  }

  @httpGet("/", ensureAuthenticated)
  async getApartmentsByAgent(req: Request, res: Response) {
    const agent = req.agent;
    const apartments = await this.apartmentService.getApartmentsByAgent(agent);
    return res.status(200).json(apartments);
  }
}
