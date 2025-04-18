import { PrismaClient } from '@prisma/client'

import { Request, Response, RequestHandler } from 'express';
const prisma = new PrismaClient()

const createUser: RequestHandler = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

const LoginUser: RequestHandler = async (req: Request, res: Response) => {
  const { token } = req.body as { token: string };
  if (!token) {
    res.status(400).json({ error: 'Token is required' });
    return;
  }
  console.log(`Token: ${token}`);
  res.status(200).json({ message: 'Login successful' });
};

export { 
  createUser, 
  LoginUser 
};