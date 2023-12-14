import express from 'express';
import { Authenticate } from '../Middleware/Authenticate.js';
import { addCart, decrementCart, deleteCart, getCartProducts, incrementCart, markAsPurchased, totalCart, } from '../Controllers/cartController.js';
const router = express.Router();

router.post('/add-to-cart',Authenticate,addCart);
router.delete('/delete-cart/:id',Authenticate,deleteCart);
router.get('/purchased-from-cart/:userId',Authenticate,markAsPurchased);
router.get('/view-cart/:userId',Authenticate,getCartProducts);
router.get('/total-cart-products/:userId',Authenticate,totalCart);
router.get('/increment/:id',Authenticate,incrementCart);
router.get('/decrement/:id',Authenticate,decrementCart);

export default router;