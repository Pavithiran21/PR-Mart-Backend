import express from 'express';
import { AllOrders, CreateOrder, DeleteOrder, EditOrder, MyOrders, OrderSummary, UpdateOrder, ViewOrder } from '../Controllers/orderController.js';
import { Admin, Authenticate } from '../Middleware/Authenticate.js';
const router = express.Router();

router.post('/add-order',Authenticate,CreateOrder);
router.put('/edit-order/:id',Authenticate,EditOrder);
router.get('/order-summary/:id',Authenticate,OrderSummary);
router.put('/update-order-status/:id',Authenticate,Admin,UpdateOrder);
router.get('/my-order/:userId',Authenticate,MyOrders);
router.get('/all-order/',Authenticate,Admin,AllOrders);
router.get('/view-order/:id',Authenticate,ViewOrder);
router.delete('/delete-order/:id',Authenticate,Admin,DeleteOrder);


export default router;