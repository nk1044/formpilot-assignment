import prisma from "../prisma.js";
import {RequestHandler } from "express";
import { verifyGoogleToken } from '../config/auth.config.js';
import { nanoid } from "nanoid";

interface GoogleUser {
    email: string;
    given_name: string;
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

        const existingUser = await prisma.user.findUnique({ where: { email } });
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

        res.status(201).json({
            message: "User registered successfully",
            user: newUser,
        });
        return;

    } catch (error) {
        console.error("RegisterUser Error:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};

const LoginUser: RequestHandler = async (req, res) => {
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

        const { email } = googleUser;

        const existingUser = await prisma.user.findUnique({
            where: { email },
            include: {
                credential: true,
            },
        });

        if (!existingUser) {
            res.status(400).json({ message: "User not found" });
            return
        }

        res.status(200).json({
            message: "User logged in successfully",
            user: existingUser,
        });
        return;

    } catch (error) {
        console.error("LoginUser Error:", error);
        res.status(500).json({ message: "Internal server error" });
        return
    }
};

export {
    LoginUser,
    RegisterUser,
};
