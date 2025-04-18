import { LoginUser, createUser } from '../controller/user.controller.js'; // Ensure this path is correct
import { Router } from 'express';

const router = Router();

router.route('/login').post(LoginUser);
router.route('/user').post(createUser);

export default router;