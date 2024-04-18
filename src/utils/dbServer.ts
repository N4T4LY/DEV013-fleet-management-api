import { PrismaClient } from "@prisma/client";
//crear y compartir una única instancia de PrismaClient en toda la aplicación. Esto se hace mediante el uso de una variable global que almacena la instancia de PrismaClient. De esta manera, se evita crear una nueva instancia cada vez que se necesite acceder a la base de datos, lo cual mejora el rendimiento y la eficiencia de la aplicación.

//almacenar una instancia de PrismaClient y acceder a los métodos de consulta y manipulación de datos
let db: PrismaClient;

//Esta variable global se utilizará para compartir la instancia de PrismaClient entre diferentes partes de la aplicación
declare global {
  var __db: PrismaClient | undefined;
}
// Se verifica si la variable global __db no existe. Si no existe, se crea una nueva instancia de PrismaClient y se asigna a __db.
if(!global.__db){
    global.__db = new PrismaClient();
}
//se asigna el valor de la variable global __db a la variable db
db = global.__db;

export { db}
