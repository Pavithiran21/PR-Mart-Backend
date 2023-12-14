import mongoose from "mongoose";
const {Schema} = mongoose;

const UserSchema = new Schema({
    firstname:{
        type:String,
    },
    lastname:{
        type:String,
    },
    username:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        require:true,
        default:"user",
        enum:["admin","user"]
       
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isVerified:{
        type:Boolean,
        required: true,
        default: false
    },
    activeToken:{
        type:String,  
    },

    activeExpires:{
        type:Date
    },
    resetToken:{
        type:String,   
    },
    resetExpires:{
        type:Date
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    },  
},
{
    timestamps: true
});



export default mongoose.model('users', UserSchema);
