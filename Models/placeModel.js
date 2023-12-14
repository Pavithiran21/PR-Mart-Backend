import mongoose from "mongoose";
const {Schema} = mongoose;

const PlaceSchema = new Schema({
      username: {
        type: String,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
      pincode: {
        type: Number,
      },
      phone:{
        type: Number,
      },
       orderStatus: {
        type: String,
        required: true,
        enum:["Processing","Ordered","Shipped","Delivered"],
        default: "Processing",
      },
      cartsItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
      }],
      
      userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      createdAt: {
          type: Date,
          default: Date.now()
      },
  
})
export default mongoose.model('orders', PlaceSchema);


