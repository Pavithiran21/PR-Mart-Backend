import mongoose from "mongoose";
const {Schema} = mongoose;

const CartSchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
    },
    quantity:{
        type:Number,
    },
    addedAt:{
        type:Date,
        default:Date.now(),
    },
    isPurchased: {
        type: Boolean,
        default: false,
    },
    
});
  
export default mongoose.model('carts', CartSchema);

