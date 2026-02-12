import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { login,register,logout} from '../controllers/user.controller.js';

const router = express.Router();

router.route('/register').post(register);

router.route('/login').post(login);

// router.route('/logout').get(logout);

export default router;