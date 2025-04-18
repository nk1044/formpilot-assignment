import UserModel from '../models/user.model.js';
import { Request, Response } from 'express';

const createUser = async ({name, email}: {name:string, email:string}) => {

    try {
        const user = await UserModel.createUser({name, email});
        if (!user) {
        return null
        }
        return null
    } catch (error) {
        console.error(error);
        return null
    }
};

const LoginUser = async (req:Request, res:Response) => {
    const 
}

export {
    LoginUser
}