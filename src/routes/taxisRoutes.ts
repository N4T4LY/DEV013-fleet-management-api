import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import {
  getTaxis,
  getTaxi,
  createTaxi,
  updateTaxi,
  deleteTaxi,
} from "../controller/taxisController";

import { getTrayectoriesByTaxi } from "../controller/trajectoriesController";
export const taxisRouter = express.Router();

taxisRouter.get("/", getTaxis);
taxisRouter.get("/:id", getTaxi);
taxisRouter.post(
  "/",
  body("plate").isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return await createTaxi(req, res);
  }
);
