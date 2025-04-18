import prisma from "../prisma.js";
import { Request, Response, RequestHandler } from "express";
import { nanoid } from "nanoid";

const getAllTasks: RequestHandler = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        user: true,
      },
    });
    res.json(tasks);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

export {
    getAllTasks,
}