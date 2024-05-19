import { PrismaClient } from "@prisma/client";
import prisma from "../utils/dbServer";
import { Request, Response } from "express";


export const getTrayectoriesByTaxi = async (req: Request, res: Response) => {
  const taxiId: number = parseInt(req.params.taxiId, 10);
  const dateString = req.query.date as string;

  const { limit, page } = req.query;
  const parsedLimit = parseInt(limit as string, 10) || 10;
  const parsedPage = parseInt(page as string, 10) || 1;
  // const page = (parsedPage - 1) * parsedLimit;

  // console.log(limit, "limite");
  // console.log(parsedPage, "page");
  // console.log(dateString, "fecha");
  // console.log(taxiId, "id");
  // console.log("page",page)
  if (!taxiId || !dateString || !parsedLimit || !parsedPage) {
    return res
      .status(400)
      .json({ error: "taxiId, date, limit and page are required" });
  }
  if (parsedPage < 0 || parsedLimit < 0) {
    return res.status(400).json({ error: "limit and page must be positive" });
  }

  try {
    const date = new Date(dateString);
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );
    const endOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 2
    );

    const trajectories = await prisma.trajectories.findMany({
      select: {
        latitude: true,
        longitude: true,
        date: true,
      },
      where: {
        taxi_id: taxiId,
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      skip: parsedPage,
      take: parsedLimit,
    });
    if (trajectories.length === 0) {
      return res.status(404).json({ error: "No trajectories found for the specified date" });
    }
    return res.status(200).json(trajectories);
  } catch (error) {
   
    res.status(500).json({ error: "there was an error on the server" });
  }
};


export const getLastReportedLocations = async (req: Request, res: Response) => {
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
          .json({ error: "The value of 'page' must be a positive integer" });
      }
    }

    if (!limit || !page) {
      return res
        .status(400)
        .json({ error: "limit and page data are required" });
    }
    const lastReportedLocations = await prisma.trajectories.findMany({
      select: {
        latitude: true,
        longitude: true,
        taxi_id: true,
        date: true,
      },
      skip: parsedPage,
      take: parsedLimit,
      orderBy: {
        date: "desc",
      },
      distinct: ["taxi_id"],
    });

    return res.status(200).json(lastReportedLocations);
  } catch (error) {
    
    res.status(500).json({ error: "there was an error on the server" });
  }
};