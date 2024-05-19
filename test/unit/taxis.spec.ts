import { PrismaClient } from '@prisma/client';
import { getTaxis,getTaxi, createTaxi, updateTaxi, deleteTaxi} from '../../src/controller/taxisController'
//importacion de datos para hacer las solicitudes http
import { Request, Response } from 'express';
//importamos prisma de dbserver para simular las interacciones con la BD
import prisma from '../../src/utils/dbServer';
