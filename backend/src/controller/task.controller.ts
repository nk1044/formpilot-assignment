import { log } from "console";
import prisma from "../prisma.js";
import { Request, Response, RequestHandler } from "express";


const createTask: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { value, txHash }:{value:string, txHash:string} = req.body;
    
    const userId = (req as any).user.id;
    const credentialId = (req as any).credential.id;

    const task = await prisma.task.create({
      data: {
        value: value ?? null,
        txHash,
        userId,
        credentialId,
      },
    });
    // console.log("Task Created:", task);

    
    res.status(201).json(task);
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllTasks: RequestHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const tasks = await prisma.task.findMany({
      where: { userId },
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Get All Tasks Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getTaskById: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { txHash } = req.params;
    const userId = (req as any).user.id;
    // console.log("Fetching task with txHash:", txHash);
    const task = await prisma.task.findFirst({
      where: {
        txHash: txHash as string,
        userId,
      },
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Get Task By ID Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const updateTask: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { txHash } = req.params;
    const { value } = req.body;
    const userId = (req as any).user.id;

    const task = await prisma.task.findFirst({
      where: { txHash: txHash, userId },
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id: task.id },
      data: {
        value: value ?? task.value,
      },
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const deleteTask: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { txHash } = req.params;
    const userId = (req as any).user.id;
    // console.log("Deleting task with txHash:", txHash);
    
    const task = await prisma.task.findFirst({
      where: { txHash: txHash, userId },
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    await prisma.task.delete({
      where: { id: Number(task.id) },
    });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
