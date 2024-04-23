import {db} from "../utils/dbServer";

type Taxis={
    id: number;          
  plate:string;
}
export const listTaxis =async ():Promise<Taxis[]> => {
    return db.taxis.findMany({
        select: {
            id:true,
            plate:true
        },
    })
}


export const getTaxi = async(id: number):Promise<Taxis|null>=>{
    return db.taxis.findUnique({
        where:{
            id:id,
        }
    })
}


export const createTaxi = async (
    taxi: Omit<Taxis, "id"> & { id: number }
  ): Promise<Taxis> => {
    const { id, plate } = taxi;
  
    return db.taxis.create({
      data: {
        id,
        plate,
      },
      select: {
        id: true,
        plate: true,
      },
    });
  };
