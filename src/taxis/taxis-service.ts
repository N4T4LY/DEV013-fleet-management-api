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
