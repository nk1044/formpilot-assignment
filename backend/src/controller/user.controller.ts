import prisma from "../prisma.js";
import {RequestHandler } from "express";
import { verifyGoogleToken } from '../config/auth.config.js';
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

interface GoogleUser {
    email: string;
    given_name: string;
}

const GenerateToken = async (id:number)=> {
    const user = await prisma.user.findUnique({
        where: { id }
    });
    const AccessToken = jwt.sign(
        {
            id: user?.id,
            email: user?.email
        }, 
        process.env.ACCESS_TOKEN_SECRET as string, 
        {expiresIn: "1d",}
    );
    return AccessToken;
}

const RegisterUser: RequestHandler = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            res.status(400).json({ message: "Token is required" });
            return
        }

        const googleUser = await verifyGoogleToken(token) as GoogleUser | null;

        if (!googleUser) {
            res.status(400).json({ message: "Invalid Google token" });
            return
        }

        const { email, given_name: name } = googleUser;

        const existingUser = await prisma.user.findUnique({ 
            where: { email } 
        });
        
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return
        }

        const apiKey = `formpilot_${nanoid(30)}`;
        const apiUrl = 'https://localhost:8002/api/v1';

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                credential: {
                    create: {
                        apiKey,
                        apiUrl,
                    },
                },
            },
            include: {
                credential: true,
            },
        });
        
        const accessToken = await GenerateToken(newUser.id);

        res
        .status(201)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })
        .json({
            message: "User registered successfully",
            user: newUser,
            token: accessToken,
        });
        return;

    } catch (error) {
        console.error("RegisterUser Error:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};

// Adding the LoginUser function based on the error message
const LoginUser: RequestHandler = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            res.status(400).json({ message: "Token is required" });
            return;
        }

        const googleUser = await verifyGoogleToken(token) as GoogleUser | null;

        if (!googleUser) {
            res.status(400).json({ message: "Invalid Google token" });
            return;
        }

        const { email } = googleUser;

        // Fixed: Remove the include statement or use the correct relation name
        const existingUser = await prisma.user.findUnique({
            where: { email },
            include: {
                credential: true // This should work now with the correct relation name from schema
            }
        });

        if (!existingUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const accessToken = await GenerateToken(existingUser.id);

        res
        .status(200)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })
        .json({
            message: "Login successful",
            user: existingUser,
            token: accessToken,
        });
        return;

    } catch (error) {
        console.error("LoginUser Error:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};


const GetUser: RequestHandler = async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                credential: true,
            },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return
        }
        res.status(200).json({
            message: "User retrieved successfully",
            user,
        });
        return;
    } catch (error) {
        console.error("GetUser Error:", error);
        res.status(500).json({ message: "Internal server error" });
        return
    }
};

export {
    LoginUser,
    RegisterUser,
    GetUser,
};
