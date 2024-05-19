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

export const createTaxi = async (req: Request, res: Response) => {
  const { id, plate } = req.body;

  if (!id || !plate) {
    return res
      .status(400)
      .json({ error: "The'id' and 'plate' data are required" });
  }

  const newTaxi = await prisma.taxis.create({
    data: {
      id,
      plate,
    },
    select: {
      id: true,
      plate: true,
    },
  });

  return res.status(201).json(newTaxi);
};

export const updateTaxi = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    const { plate } = req.body;

    if (!id || id <= 0 || isNaN(id)) {
      return res
        .status(400)
        .json({ error: "The ID must be a positive integer" });
    }

    if (!plate) {
      return res.status(400).json({ error: "the 'plate' data is required" });
    }

    const updatedTaxi = await prisma.taxis.update({
      where: {
        id,
      },
      data: {
        plate,
      },
      select: {
        id: true,
        plate: true,
      },
    });

    return res.status(200).json(updatedTaxi);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteTaxi = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);

    if (!id || id <= 0) {
      return res
        .status(400)
        .json({ error: "The ID must be a positive integer" });
    }

    await prisma.taxis.delete({
      where: {
        id,
      },
    });

    return res.status(204).json({ msg: "The taxi was successfully deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
