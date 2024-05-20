import { PrismaClient } from '@prisma/client';
import { getTrajectoriesByTaxi, getLastReportedLocations} from '../../src/controller/trajectoriesController'
import { Request, Response } from 'express';
import prisma from '../../src/utils/dbServer';
