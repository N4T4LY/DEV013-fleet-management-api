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

//describe: agrupacion de varias pruebas relacionadas, it, define prueba individual
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

  it('should return 500 if there is an internal server error', async () => {
    const mockReq = { query: { limit: '2', page: '0' } } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (prisma.taxis.findMany as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

    await getTaxis(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('getTaxi', () => {
  it('should return the taxi for a valid ID', async () => {
    const mockTaxi = { id: 1, plate: 'ABC123' };
    const mockReq = { params: { id: '1' } } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (prisma.taxis.findUnique as jest.Mock).mockResolvedValue(mockTaxi);

    await getTaxi(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockTaxi);
    expect(prisma.taxis.findUnique).toHaveBeenCalledWith({
      where: { id: 1 }, // Eliminado `select` aquí
    });
  });

  it('should return 400 if ID is not provided', async () => {
    const mockReq = { params: {} } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await getTaxi(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "The ID must be a positive integer" }); // Mensaje ajustado aquí
  });

  it('should return 404 if taxi is not found', async () => {
    const mockReq = { params: { id: '1' } } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (prisma.taxis.findUnique as jest.Mock).mockResolvedValue(null);

    await getTaxi(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith("Taxi not found");
  });

  it('should return 500 if there is an internal server error', async () => {
    const mockReq = { params: { id: '1' } } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (prisma.taxis.findUnique as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

    await getTaxi(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('createTaxi', () => {
  it('should return 400 if id or plate are missing', async () => {
    const mockReq = { body: {} } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await createTaxi(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "The'id' and 'plate' data are required" });
  });
  it('should create a new taxi', async () => {
    const mockReq = { body: { id: 1, plate: 'ABC123' } } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const mockNewTaxi = { id: 1, plate: 'ABC123' };

    (prisma.taxis.create as jest.Mock).mockResolvedValue(mockNewTaxi);

    await createTaxi(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockNewTaxi);
  });
});


describe('updateTaxi', () => {
  it('should return 400 if ID is not valid', async () => {
    const mockReq = { params: { id: 'invalid' }, body: { plate: 'ABC123' } } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await updateTaxi(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "The ID must be a positive integer" });
  });
  it('should return 400 if plate is missing', async () => {
    const mockReq = { params: { id: '1' }, body: {} } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await updateTaxi(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "the 'plate' data is required" });
  });
  it('should update an existing taxi', async () => {
    const mockReq = { params: { id: '1' }, body: { plate: 'DEF456' } } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const mockUpdatedTaxi = { id: 1, plate: 'DEF456' };

    (prisma.taxis.update as jest.Mock).mockResolvedValue(mockUpdatedTaxi);

    await updateTaxi(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedTaxi);
  });
  it('should return 500 if there is an internal server error', async () => {
    const mockReq = { params: { id: '1' }, body: { plate: 'DEF456' } } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (prisma.taxis.update as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

    await updateTaxi(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
})

describe('deleteTaxi', () => {
  it('should return 400 if ID is not valid', async () => {
    const mockReq = { params: { id: 'invalid' } } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await deleteTaxi(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "The ID must be a positive integer" });
  });

  it('should delete an existing taxi', async () => {
    const mockReq = { params: { id: '1' } } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await deleteTaxi(mockReq, mockRes);

    expect(prisma.taxis.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.json).toHaveBeenCalledWith({ msg: "The taxi was successfully deleted" });
  });
})