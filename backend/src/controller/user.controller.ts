import prisma from "../prisma.js";
import { Request, Response, RequestHandler } from "express";
import {verifyGoogleToken} from '../config/auth.config.js';

interface GoogleUser {
    email: string;
    given_name: string;
    family_name?: string;
  }


interface GoogleUser {
  email: string;
  given_name: string;
  family_name?: string;
}

const RegisterUser: RequestHandler = async (req, res) => {
  try {
    const { token } = req.body;
    // console.log("token", token);
    const googleUser = await verifyGoogleToken(token) as GoogleUser | null;
    if (!googleUser) {
      res.status(400).json({ message: "Invalid Google token" });
      return;
    }

    const name = googleUser.given_name;
    const email = googleUser.email;

    // Here you could create/find user in DB

    res.status(200).json({
      message: "User registered successfully",
      user: googleUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const LoginUser = async (req: Request, res: Response) => {

}


export {
    LoginUser,
    RegisterUser,
}