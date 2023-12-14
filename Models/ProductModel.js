import mongoose from "mongoose";
const {Schema} = mongoose;

const ProductSchema = new Schema({

    ProductName: {
        type: String,
    },
    Description: {
        type: String,
    },
    Price: {
        type: Number,
    },
    ProductImageUrl: {
        type: String,
    },
    Category: {
        type: String,
    },
    Quantity: {
        type: Number,
    },
    
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt:{
        type:Date,
    }
},{
    timestamps: true
});

export default mongoose.model('products', ProductSchema);
