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


/**
 * 
 * @swagger
 * components:
 *  schemas:
 *    Taxis:
 *      type: object
 *      properties:
 *        id: 
 *          type: integer
 *          description: The id of the taxi
 *        plate:
 *          type: string
 *          description: The plate of the taxi
 *      required:
 *        - id
 *        - plate
 *      example:
 *        id: 85
 *        plate: "DDAD-8350"
 *    TaxiNotFound:
 *      type: object
 *      properties:
 *        msg:
 *          type: string
 *          description: A message for the not found taxi
 *        example:
 *          msg: "Taxi was not found"
 *          
 *  parameters:
 *    taxiId:
 *      in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: integer
 *        description: id of the taxi to query
 * 
 */ 


/**
 * @swagger
 * tags:
 *    - name: Taxis
 *      description: Taxis endpoints
 *    - name: Trajectories Query 
 *      description: Query endpoints
 */


taxisRouter.get("/", getTaxis);
/**
 *
 * @swagger
 *  /taxis:
 *    get:
 *      summary: Return a Taxis list
 *      tags:
 *        [Taxis]
 *      parameters:
 *        - in: query
 *          name: limit
 *          schema: 
 *            type: integer
 *          description: Numbers of elements per page
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *          description: Page of the list to consult
 *      responses:
 *        200:
 *          description: List of taxis successfully obtained
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Taxis'
 *                 
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *              type: object
 *              properties:
 *                msg: string
 *              example:
 *                msg: "Internal server error"
 */
taxisRouter.get("/:id", getTaxi);
/**
 * @swagger
 *  /taxis/{id}:
 *    get:
 *      summary: Get data of a specific taxi
 *      tags:
 *         [Taxis]
 *      parameters:
 *        - $ref: '#/components/parameters/taxiId'
 *      responses:
 *        200:
 *          description: The taxi was found
 *          content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Taxis'
 *          
 *        400:
 *          description: Invalid id
 *          content:
 *            application/json:
 *              schema:
 *              type: object
 *              properties:
 *                msg: string
 *              example:
 *                msg: "Invalid id"
 *        404: 
 *          description: Taxi not found
 *          content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/TaxiNotFound'
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *              type: object
 *              properties:
 *                msg: string
 *              example:
 *                msg: "Internal server error"
 */
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
taxisRouter.put(
  "/:id",
  body("plate").isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return await updateTaxi(req, res);
  }
);
taxisRouter.delete("/:id", deleteTaxi);
taxisRouter.get('/trajectories/:taxiId', getTrayectoriesByTaxi);