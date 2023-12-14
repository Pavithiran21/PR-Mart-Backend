import Order from "../Models/placeModel.js";
import Cart from '../Models/cartModel.js';


export const CreateOrder = async (req, res) => {
  try {
    const { address, city, state, country, pincode, phone, cartsItems,username,userId } = req.body;

    const existingOrder = await Order.findOne({ cartsItems: cartsItems });

    if (existingOrder) {
      return res.json({ status: false, message: "Order with the same cart items already exists" });
    }

    const carts = await Cart.find({ _id: { $in: cartsItems } });
    


    const order = new Order({
      username,
      address,
      city,
      state,
      country,
      pincode,
      phone,
      userId:userId,
      cartsItems: carts.map(cart => cart._id)
    });
    await order.save();
    if (order) {
      res.json({ status: true, message: "Order Details Created Successfully", data: order });
    } else {
      res.json({ status: false, message: "Order cannot be created. please try again...." });
    }
  } catch (err) {
    console.error(err);
    res.json({ status: false, message: "Something went wrong" });
  }
};

export const EditOrder = async (req, res) => {
    try {
        
        const { address, city, state, country, pincode, phone,username } = req.body;

        const updatedOrder = await Order.findOneAndUpdate(
            { _id: req.params.id }, 
            {
                
                username:username,
                address:address,
                city:city,
                state:state,
                country:country,
                pincode:pincode,
                phone:phone,
            },
            { new: true } 
        );

        if (!updatedOrder) {
            res.json({ status: false, message: "Order Cannot Updated. Please try again!!!" });
        } else {
            res.json({
                status: true,
                message: "Order Updated Successfully",
                data: updatedOrder,
            });
        }
    } catch (err) {
        console.log(err);
        res.json({ status: false, message: "Something went wrong" });
    }
}


export const UpdateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate({_id:req.params.id});

    if (!order) {
      return res.json({ status: false, message: "Order not found" });
    }

    let updateMessage = "";

    switch (order.orderStatus) {
      case "Processing":
        order.orderStatus = "Ordered";
        updateMessage = "Ordered";
        break;
      case "Ordered":
        order.orderStatus = "Shipped";
        updateMessage = "Shipped";
        break;
      case "Shipped":
        order.orderStatus = "Delivered";
        updateMessage = "Delivered";
        break;
      default:
        return res.json({ status: false, message: "Invalid order status" });
    }

    await order.save();

    return res.json({
      status: true,
      message: `Updated Order Status as ${updateMessage} Successfully`,
      data: order,
    });
  } catch (err) {
    console.error(err);
    res.json({ status: false, message: "Something went wrong" });
  }
};


export const ViewOrder = async(req,res)=>{
    try{
        const order = await Order.findOne({_id:req.params.id})
        .populate({
            path: 'cartsItems',
            select: 'product quantity',
            model: 'carts', // Make sure this references the correct model name
            populate: [
                {
                    path: 'product',
                    select: 'ProductName Description Price Category ProductImageUrl',
                    model: 'products',
                },
            ],
      })
        .exec();
        console.log(order);
        if(order){
            const cartItems = order.cartsItems.map((cartItem) => ({
                product: cartItem.product,
                quantity: cartItem.quantity,
            }));
            res.json({status:true,message:" Order Viewed found Successfully",data:order});
        }
        else{
            res.json({status:false,message:"Order cannot be viewed. please try again!!!"});
        }

    }
    catch(err){
        console.log(err);
        res.json({status:false,message:"Something went wrong"});
    }
}

export const MyOrders = async (req, res) => {
  try {
      const orders = await Order.find({ userId: req.params.userId })
          .populate({
              path: 'cartsItems',
              select: 'product quantity',
              model: 'carts', // Make sure this references the correct model name
              populate: [
                  {
                      path: 'product',
                      select: 'ProductName Description Price Category ProductImageUrl',
                      model: 'products',
                  },
              ],
        })
          .exec();
       console.log(orders);

      if (orders.length > 0) {
          res.json({ status: true, message: "My Orders found successfully", data: orders });
      } else {
          res.json({ status: false, message: "My Orders cannot be found. Please try again!!!" });
      }
  } catch (err) {
      console.log(err);
      res.json({ status: false, message: "Something went wrong" });
  }
};

  
export const AllOrders = async(req,res)=>{
    try{
        const order = await Order.find().populate({
            path: 'cartsItems',
            select: 'product quantity',
            model: 'carts', // Make sure this references the correct model name
            populate: [
                {
                    path: 'product',
                    select: 'ProductName Description Price Category ProductImageUrl',
                    model: 'products',
                },
            ],
      })
        .exec();
        console.log(order);
        if(order){
            res.json({status:true,message:"All Orders found Successfully",data:order});
        }
        else{
            res.json({status:false,message:"All Orders cannot be found. please try again!!!"});
        }

    }
    catch(err){
        console.log(err);
        res.json({status:false,message:"Something went wrong"});
    }
}


export const DeleteOrder = async(req,res)=>{
    try{
        const order = await Order.findByIdAndDelete({_id:req.params.id});
        if(order){
            res.json({status:true,message:"Order Deleted Successfully",data:order});
        }
        else{
            res.json({status:false,message:"My Orders cannot be deleted. please try again!!!"});
        }
    }
    catch(err){
        console.log(err);
        res.json({status:false,message:"Something went wrong"});
    }
}



export const OrderSummary = async(req,res) =>{
    try{
        const {id} = req.params;
        const order = await Order.findById(id).populate({
            path: 'cartsItems',
            select: 'product quantity',
            model: 'carts',
            populate: [
              {
                path: 'product',
                select: 'ProductName Description Price Category ProductImageUrl', // Exclude the 'password' field
                model: 'products',
              },
            ],
          })
          .exec();
        console.log(order);
        if(order){
            res.json({status:true,message:"Order Summary found Sucessfully",data:order});
        }
        else{
            res.json({ status: false, message: "Order Summary cannot be . Please try again!!!" });
        }
    }
    catch(err){
      console.error(err);
      res.json({ status: false, message: "Something went wrong" });
    }
}
