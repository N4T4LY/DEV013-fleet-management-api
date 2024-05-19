import { PrismaClient } from '@prisma/client';
import { getTaxis,getTaxi, createTaxi, updateTaxi, deleteTaxi} from '../../src/controller/taxisController'
//importacion de datos para hacer las solicitudes http
import { Request, Response } from 'express';
//importamos prisma de dbserver para simular las interacciones con la BD
import prisma from '../../src/utils/dbServer';

//aqui moqueamos dbserver para reemplazar prisma un objetos simulados , jest.fn crea funciones simuladas, 
jest.mock('../../src/utils/dbServer', () => ({
  
  taxis: {
    //creamos funciones simuladas de prisma usando jestfn
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));
