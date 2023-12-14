import express from 'express';
import { Admin, Authenticate } from '../Middleware/Authenticate.js';
import { AllProduct, CreateProduct, DeleteProduct, EditProduct, SearchProduct, ViewProduct } from '../Controllers/productController.js';

const router = express.Router();

router.post('/create-product',Authenticate,Admin,CreateProduct);
router.put('/edit-product/:id',Authenticate,Admin,EditProduct);
router.get('/view-product/:id',Authenticate,ViewProduct);
router.get('/all-products/',AllProduct);
router.delete('/delete-product/:id',Authenticate,Admin,DeleteProduct);
router.get('/search-products',SearchProduct);


export default router;