import prisma from "../prisma.js";
import { Request, Response, NextFunction } from "express";

const verifyTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();
    console.log("Token:", token);
    if (!token) {
      res.status(401).json({ error: "Authorization token missing" });
      return;
    }

    const credential = await prisma.credential.findUnique({
      where: {
        apiKey: token,
      },
      include: {
        user: true,
      },
    });
    console.log("Credential:", credential);
    if (!credential || !credential.user) {
      res.status(401).json({ error: "Invalid or expired token" });
      return
    }

    if(credential.usageCount >= credential.availableUsageCount) {
      res.status(401).json({ error: "Credit Usage limit exceeded" });
      return;
    }
    const updatedCredentials = await prisma.credential.update({
      where: {
        id: credential.id,
      },
      data: {
        usageCount: credential.usageCount + 1,
      },
    });


    (req as any).user = credential.user;
    (req as any).credential = updatedCredentials;

    next();
  } catch (error) {
    console.error("verifyTask middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export { verifyTask };
