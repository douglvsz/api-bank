import { Router } from "express";
import * as user from './controllers/usercontrol.js';
import * as bank from './controllers/bankcontrol.js'
import { auth } from "./middleware/auth.js";
const router = Router()

//Public
router.post('/register', user.register);
router.post('/login', user.login );

//Private
router.post('/deposit', auth, bank.deposito);
router.post('/transfer', auth, bank.transfer);
router.get('/saldo', auth, bank.consulta)



export default router;