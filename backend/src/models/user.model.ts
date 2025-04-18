import prisma from "../prisma.js";


export interface User {
  id: number;
  name: string;
  email: string;
}

class UserModel {
  // Create a new user
  static async createUser(data: { name: string; email: string }) {
    return await prisma.user.create({
      data,
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
