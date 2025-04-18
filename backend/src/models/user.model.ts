import prisma from "../prisma.js";
import { nanoid } from "nanoid";

export interface User {
  id: number;
  name: string;
  email: string;
  apikey: string;
  apiurl: string;
  createdAt: Date;
  updatedAt: Date;
}

class UserModel {
  // Create a new user
  static async createUser(data: { name: string; email: string }) {

    if (!data.name || !data.email) {
      return null
    }

    const apiKey = `key_${nanoid(24)}`;
    const apiUrl = `https://localhost:8002/api/tasks/${nanoid(12)}`;

    return await prisma.user.create({
        data: {
          ...data,
          apikey: apiKey,
          apiurl: apiUrl,
        },
    });
  }

  // Get a user by ID
  static async getUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  // Get all users
  static async getAllUsers() {
    return await prisma.user.findMany();
  }

  // Update user by ID
  static async updateUser(id: number, data: { name?: string; email?: string }) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  // Delete user by ID
  static async deleteUser(id: number) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}

export default UserModel;
