import express, { response } from "express"
import type { Request, Response } from "express"
import {body , validationResult} from "express-validator"
import * as taxisService from "./taxis-service"

export const taxisRouter =express.Router()

//GET: listar
taxisRouter.get("/", async (request:Request,response: Response)=>{
    try{
        
        const taxis= await taxisService.listTaxis()
        return response.status(200).json(taxis)
    }catch(error:any){
        return response.status(500).json(error.message)

    }
})
