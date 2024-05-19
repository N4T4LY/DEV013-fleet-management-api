import { PrismaClient } from "@prisma/client";
import prisma from "../utils/dbServer";
import { Request, Response } from "express";
export const getTaxis = async (req: Request, res: Response) => {
  try {
    const { limit, page } = req.query;

    let parsedLimit = 10;
    let parsedPage = 0;

    if (limit) {
      parsedLimit = parseInt(limit as string, 10);
      if (parsedLimit < 0) {
        return res
          .status(400)
          .json({ error: "The value of 'limit' must be a positive integer" });
      }
    }

    if (page) {
      parsedPage = parseInt(page as string, 10);
      if (parsedPage < 0) {
        return res
          .status(400)
          .json({ error: "The value of 'offset' must be a positive integer" });
      }
    }

    if (!limit || !page) {
      return res
        .status(400)
        .json({ error: "limit and offset data are required" });
    }

    const taxis = await prisma.taxis.findMany({
      select: {
        id: true,
        plate: true,
      },
      skip: parsedPage,
      take: parsedLimit,
    });

    return res.status(200).json(taxis);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getTaxi = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);

 
    if (!id || id <= 0 || isNaN(id)) {
      return res
        .status(400)
        .json({ error: "The ID must be a positive integer" });
    }

    const taxi = await prisma.taxis.findUnique({
      where: {
        id,
      },
    });

    if (!taxi) {
      return res.status(404).json("Taxi not found");
    }

    return res.status(200).json(taxi);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};