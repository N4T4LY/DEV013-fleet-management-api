import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { getTrayectoriesByTaxi, getLastReportedLocations } from "../controller/trajectoriesController"

export const trajectoriesRouter = express.Router()