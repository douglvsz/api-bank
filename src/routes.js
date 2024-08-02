import { Router } from "express";
import * as user from './controllers/usercontrol.js';
import * as bank from './controllers/bankcontrol.js'
import { auth } from "./middleware/auth.js";
const router = Router()

//Public
router.post('/register', user.register);
router.post('/login', user.login );

//Private
router.get('/users', auth, user.list)
router.post('/deposit', auth, bank.deposito)



export default router;