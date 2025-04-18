import prisma from "../prisma.js";
import { Request, Response, NextFunction } from "express";

const verifyTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const credential = await prisma.credential.findUnique({
      where: {
        apiKey: token,
      },
      include: {
        user: true,
      },
    });

    if (!credential || !credential.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    (req as any).user = credential.user;
    (req as any).credential = credential;

    next();
  } catch (error) {
    console.error("verifyTask middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { verifyTask };
