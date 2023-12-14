import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './Routes/userRoute.js';
import productRote from './Routes/productRoute.js';
import cartRoute from './Routes/cartRoute.js';
import orderRoute from './Routes/orderRoute.js';
import { connectDB } from './Middleware/DB.js';
import bodyParser from 'body-parser';



const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

dotenv.config();
connectDB();



app.use('/api/users',userRoute);
app.use('/api/products',productRote);
app.use('/api/cart',cartRoute);
app.use('/api/orders',orderRoute);



const PORT = process.env.PORT || 3434

app.listen(PORT,()=> console.log(`Server running at ${PORT}`));