import prisma from "../prisma.js";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend Request to include user
interface RequestWithUser extends Request {
  user?: any;
}

interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
}

const verifyUser = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "").trim();
    
      // console.log("Token from cookies or header:", token);

    if (!token) {
    res.status(401).json({ error: "Authorization token missing" });
        return;
    }

    let decoded: DecodedToken;

    try {
      decoded = jwt.verify(
        token,
        String(process.env.ACCESS_TOKEN_SECRET)
      ) as DecodedToken;
    } catch (jwtError) {
      res.status(401).json({ error: "Invalid or expired token" });
        return;
    }

    const decodedUser = await prisma.user.findUnique({
      where: {
        id: Number(decoded.id),
        email: decoded.email,
      },
      include: {
        credential: true,
      },
    });

    if (!decodedUser) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    req.user = decodedUser;
    next();
  } catch (error) {
    console.error("verifyTask middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { verifyUser };
