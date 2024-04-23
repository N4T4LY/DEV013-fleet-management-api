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


//GET un solo taxi por id
taxisRouter.get("/:id",async(request: Request, response:Response)=>{
    const id:number = parseInt(request.params.id,10)
    console.log(id,"taxi id")
    try {
        
        const taxi = await taxisService.getTaxi(id)
        console.log(taxi,"taxi")
        if(taxi){

            return response.status(200).json(taxi)
        }else{

            return response.status(404).json("Taxi no encontrado")
        }
    } catch (error:any) {
        return response.status(500).json(error.message)
    }
})



//POST: create taxi
taxisRouter.post("/",
    body("plate").isString(),
    async(request:Request, response:Response)=>{
        const errors=validationResult(request);
        if(!errors.isEmpty()){
            return response.status(400).json({ errors: errors.array()})
        }
        try{
            const taxi = request.body
            const newTaxi=await taxisService.createTaxi(taxi)
            return response.status(201).json(newTaxi)
    
        }catch(error: any){
            return response.status(500).json(error.message)
            
        }
    }
)

//update
taxisRouter.put(
    "/:id", 
    body("plate").isString(),
async(request: Request, response: Response)=>{
    const errors=validationResult(request);
        if(!errors.isEmpty()){
            return response.status(400).json({ errors: errors.array()})
        }
        const id:number = parseInt(request.params.id,10)
        try{
            const taxi=request.body
            const updateTaxi = await taxisService.updateTaxi(taxi,id)
            return response.status(200).json(updateTaxi)
        }catch(error: any){
            return response.status(500).json(error.message);
        }
})


//delete  

taxisRouter.delete("/:id", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    console.log("id", id);
    
    try {
        await taxisService.deleteTaxi(id)
        return response.status(204).json({msg: "El taxi fue eliminado correctamente"});
       
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});