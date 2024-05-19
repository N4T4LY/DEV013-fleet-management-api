import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { getTrayectoriesByTaxi, getLastReportedLocations } from "../controller/trajectoriesController"

export const trajectoriesRouter = express.Router()
/**
 * @swagger
 * components:
 *   schemas:
 *     Trajectories:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la trayectoria
 *         taxi_id:
 *           type: integer
 *           description: ID del taxi
 *         date:
 *           type: string
 *           description: Fecha y hora de la ubicación reportada
 *         latitude:
 *           type: number
 *           format: float
 *           description: Latitud de la ubicación
 *         longitude:
 *           type: number
 *           format: float
 *           description: Longitud de la ubicación
 *       required:
 *         - id
 *         - taxi_id
 *       example:
 *         id: 27704
 *         taxi_id: 7957
 *         date: "2008-02-08T17:10:16.000Z"
 *         latitude: 116.23249
 *         longitude: 39.91784
 *         taxis:
 *           id: 7957
 *           plate: "BAJW-7971"
 */


                
/**
 * @swagger
 * tags:
 *     - name: Trajectories Query 
 *       description: Query endpoints
 */
trajectoriesRouter.get("/",getLastReportedLocations);