import { Router } from 'express';
import { RegisterUser, LoginUser } from '../controller/user.controller.js';
const router = Router();


router.route('/register').post(RegisterUser);
router.route('/login').post(LoginUser);

export default router;