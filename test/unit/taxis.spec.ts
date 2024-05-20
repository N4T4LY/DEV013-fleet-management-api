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

describe('getTaxis', () => {
  it('should return taxis with pagination', async () => {
    //simulamos la respuesta que esperamos que suceda
    const mockTaxis = [{ id: 1, plate: 'ABC123' }, { id: 2, plate: 'DEF456' }];
    //simulamos la respuesta y el request con valores simulados. 
    const mockReq = { query: { limit: '2', page: '0' } } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (prisma.taxis.findMany as jest.Mock).mockResolvedValue(mockTaxis);

    await getTaxis(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockTaxis);
    expect(prisma.taxis.findMany).toHaveBeenCalledWith({
      select: { id: true, plate: true },
      skip: 0,
      take: 2,
    });
  });

  it('should return 400 if limit or page are not provided', async () => {
    const mockReq = { query: {} } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await getTaxis(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'limit and offset data are required' });
  });

  it('should return 400 if limit is negative', async () => {
    const mockReq = { query: { limit: '-1', page: '0' } } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await getTaxis(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "The value of 'limit' must be a positive integer" });
  });

  it('should return 400 if page is negative', async () => {
    const mockReq = { query: { limit: '2', page: '-1' } } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await getTaxis(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "The value of 'offset' must be a positive integer" });
  });


})