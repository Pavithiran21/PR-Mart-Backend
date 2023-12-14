import Cart from '../Models/cartModel.js';
import Product from "../Models/ProductModel.js";

export const getCartProducts = async (req, res) => {
  try {
    const carts = await Cart.find({userId:req.params.userId,isPurchased: false}).populate("product");
    console.log(carts);
    if(carts.length > 0){
      res.json({status:true,message:"Cart Product Found Successfully",data:carts});
    }
    else{
      res.json({status:false,message:"Cannot find the Cart Product. Please try again!!!"});
    }
  } catch (err) {
    console.log(err)
    res.json({status:false,message:"Something went wrong"});
  }
}

export const addCart = async (req, res) => {
  try {
    const product = req.body.product; // Assuming 'id' in the request body is the product ID
    const quantity = req.body.quantity || 1;
    const userId = req.body.userId;

    // Check if the product with the given ID exists in the database
    const products = await Product.findById(product).populate('ProductName Description Price Category ProductImageUrl Quantity');

    if (!products) {
      return res.json({ status: false, message: "Product not found" });
    }
     else {
      // If the product doesn't exist in the cart, create a new cart entry
      const cart = await Cart.create({
        product:product,
        quantity:quantity,
        userId:userId
      });
      cart.save();

      // Fetch the cart information after adding the product
      const updatedCart = await Cart.findById(cart._id).populate('product');
      console.log(updatedCart);
      updatedCart.save();

      if (updatedCart) {
        return res.json({ status: true, message: "Product added to the cart successfully", data: updatedCart });
      } else {
        return res.json({ status: false, message: "Product could not be added to the cart. Please try again!!!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.json({ status: false, message: "Something went wrong" });
  }
}

export const deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({_id:req.params.id});
    console.log(cart);
    if(cart){
      res.json({status:true,message:"Product Deleted from the Cart  Successfully",data:cart});
    }
    else{
      res.json({status:false,message:"Product cannot be deleted to the cart. Please try again!!!"});
    }
  } catch (err) {
    console.log(err);
    res.json({status:false,message:"Something went wrong"});
  }

};


export const markAsPurchased = async (req, res) => {
  try {
    const carts = await Cart.find({ userId: req.params.userId, isPurchased: false });

    if (carts.length > 0) {
      for (const cart of carts) {
        cart.isPurchased = true;
        await cart.save(); // Use await here to wait for the save operation to complete
      }

      res.json({ status: true, message: "Products purchased from the cart successfully", data: carts });
    } else {
      res.json({ status: false, message: "Products already purchased from the cart. Please try again!!!" });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: false, message: "Something went wrong" });
  }
};



export const totalCart = async(req,res)=>{
  try {
    const carts = await Cart.find({userId:req.params.userId,isPurchased:false});
    const total = carts.length;
    console.log(total);
    res.json({status:true,message:"Total Cart Product Found Successfully",data:total});
  } catch (err) {
    console.log(err)
    res.json({status:false,message:"Something went wrong"});
  }
}


export const incrementCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate('product');

    if (!cart) {
      return res.json({ status: false, message: "Cart not found" });
    }
    cart.quantity += 1;

    await cart.save();

    return res.json({ status: true, message: "Cart quantity incremented successfully", data: cart });
  } catch (err) {
    console.error(err);
    return res.json({ status: false, message: "Something went wrong" });
  }
};

export const decrementCart = async (req, res) => {
  try {
    

    const cart = await Cart.findById(req.params.id).populate('product');

    if (!cart) {
      return res.json({ status: false, message: "Cart not found" });
    }
    if (cart.quantity > 1) {
      cart.quantity -= 1;
      await cart.save();
      return res.json({ status: true, message: "Cart quantity decremented successfully", data: cart });
    } else {
      return res.json({ status: false, message: "Cart quantity cannot go below 1" });
    }
  } catch (err) {
    console.error(err);
    return res.json({ status: false, message: "Something went wrong" });
  }
};




