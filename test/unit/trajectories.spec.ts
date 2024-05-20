import { PrismaClient } from '@prisma/client';
import { getTrajectoriesByTaxi, getLastReportedLocations} from '../../src/controller/trajectoriesController'
import { Request, Response } from 'express';
import prisma from '../../src/utils/dbServer';

describe('getTrajectoriesByTaxi', () => {
  it('should return 400 if required parameters are missing', async () => {
    const mockReq = { params: {}, query: {} } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await getTrajectoriesByTaxi(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "taxiId, date, limit and page are required" });
  });
  it('should return 400 if limit or page are not positive numbers', async () => {
    const mockReq = { params: { taxiId: '1' }, query: { date: '2024-05-15', limit: '-1', page: '0' } } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await getTrajectoriesByTaxi(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "limit and page must be positive" });
  });
})
