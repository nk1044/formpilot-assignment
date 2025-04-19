import { Router } from 'express';
import { RegisterUser, LoginUser , GetUser, UpdateCredits} from '../controller/user.controller.js';
import {verifyUser} from '../middleware/auth.middleware.js';

const router = Router();


router.route('/register').post(RegisterUser);
router.route('/login').post(LoginUser);
router.route('/get-current-user').get(verifyUser, GetUser);
router.route('/update-credits').post(verifyUser, UpdateCredits);

export default router;