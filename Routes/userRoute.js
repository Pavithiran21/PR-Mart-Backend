import express from 'express';
import { AdminDashboard, Allusers, Deleteuser, activeAccount, forgot, login, register, reset } from '../Controllers/userController.js';
import { Admin, Authenticate } from '../Middleware/Authenticate.js';



const router = express.Router();

router.post('/register',register);
router.get('/activate/:activeToken',activeAccount);
router.post('/reset',forgot);
router.put('/reset/:resetToken',reset);
router.post('/login',login);
router.get('/all-users',Authenticate,Admin,Allusers);
router.delete('/delete-users/:id',Authenticate,Admin,Deleteuser);
router.get('/admin-dashboard',Authenticate,Admin,AdminDashboard);



export default router;