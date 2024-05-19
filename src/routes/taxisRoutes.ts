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


taxisRouter.delete("/:id", deleteTaxi);