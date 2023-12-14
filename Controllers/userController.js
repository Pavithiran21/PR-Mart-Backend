import User from '../Models/userModel.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import { SendMail } from '../Middleware/email.js';
import Product from "../Models/ProductModel.js";
import Order from "../Models/placeModel.js";


const salt = bcrypt.genSaltSync(10);



export const register = async(req,res)=>{
    try{
        const {firstname,lastname,username, email, password} = req.body;
        const user = await User.findOne({"email":email});
        if(!user){
            const reg = new User();
            reg.firstname = firstname;
            reg.lastname = lastname;
            reg.username = username;
            reg.email = email;
            reg.password = await bcrypt.hash(password,salt);
            reg.activeToken = crypto.randomBytes(32).toString("hex");
            console.log(reg.activeToken);
            reg.activeExpires = Date.now() + 24 * 3600 * 1000;

            let ActiveLink =`${process.env.BASE_URL}/activate/${reg.activeToken}`;

            
            SendMail(
                reg.email,
                "Thanks for Registering your Account. Please Activate and Verify your Account",
               `Please click the following link to activate your account: ${ActiveLink}`,
               `<p>Please click the following link to activate your account: <a href="${ActiveLink}">${ActiveLink}</a></p>`
            );
            reg.save();
            console.log(reg);
            res.json({status:true,message:"User Registered Successfuly.Please check the mail to activate your account!!!",data:reg}); 
        }
        else{
            res.json({status:false,message:"Already Registered"});
        }
    }
    catch(err){
        console.log(err);
        res.json({status:false,message:"Something wenrt wrong"});
    }
}

export const activeAccount = async(req,res) =>{ 

    try{       
        const user = await User.findOne({"activeToken": req.params.activeToken,activeExpires:{$gt:Date.now()}, isVerified:false })
        console.log(user);
        if(user){
            user.isVerified = true;
            user.save();
            console.log(user);
            res.json({status:true,message:"Account Activated Successfully",data:user})
        }
        else{
            res.json({ status: false, message: "Account Activation Link Expired. Please Activate New Link" });   
        }
       
    }
    catch(err){
        console.log(err);
        res.json({status:false,message:"Something wenrt wrong"});

    }
} 


export const login = async (req, res) => {
  
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email, isVerified: true });
  
      if (user) {
        const isPasswordMatched = await bcrypt.compare(password, user.password);
  
        if (isPasswordMatched) {
          const token = JWT.sign(
            {
              id: user._id,
            },
            process.env.JWT_TOKEN,
          );
  
          console.log(token);
          res.json({
            status: true,
            message: "User Logged in Successfully",
            data: user,
            user_token: token,
          });
          console.log(user);
        } else {
          res.json({ status: false, message: "Invalid email or password" });
        }
      } else {
        res.json({ status: false, message: "User not found" });
      }
    } catch (err) {
      console.log(err);
      res.json({ status: false, message: "Something went wrong" });
    }
  
  
};

export const  forgot = async(req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email,isVerified:true});
        console.log(user);
 
        if(user){
            user.resetToken = crypto.randomBytes(32).toString("hex")
            user.resetExpires = Date.now() + 24 * 3600 * 1000;

        
            let resetlink = `${process.env.BASE_URL}/reset/${user.resetToken}`;

            
            await SendMail(
              user.email,
              'Password Recovery Mail',
              `Please click the following link to Reset Password: ${resetlink}`,
              `<p>Please click the following link to Reset Password: <a href="${resetlink}">${resetlink}</a></p>`

            )
            user.save();
            console.log(user);
            res.json({status:true,message:"User Password Reset Link sent Successfully",data:user});
 
        }
        else{
            res.json({status:false,message:"Password Reset Link Invalid or Expired"});
        }
    }
    catch(err){
        console.log(err);
        res.json({status:false,message:"Something went wrong"});
    }
    

}



export const reset = async(req,res)=>{
    try {
        const {password} = req.body;
        
        const user = await User.findOne({ resetToken:req.params.resetToken,resetExpires:{$gt:Date.now()}});
        if (user) {
            bcrypt.hash(password, salt, function (err, hash) {
                user.password = hash
                user.updatedAt = Date.now()
                user.save();
            });
            console.log(user);          
            res.json({ status: true, message: "User  Password Reseted Successfully",data:user});
        }
        else {
            res.json({ status: false, message: " User  Password Reset is  invalid Link or expired.Please try again"});
        }
    } 
    catch(err){
        console.log(err);
        res.json({status:false,message:"Something went wrong"});
    }

}


export const Allusers = async(req,res)=>{
    try{
        const  users = await User.find({role:"user"});
        if(users){
           res.json({status:true,message:"All Users are Found Successfully",data:users});
        }
        else{
            res.json({status:false,message:"Users cannot be found.Please try again"}); 
        }
    }
    catch(err){
        console.log(err);
        res.json({status:false,message:"Something went wrong"});
    }
}

export const Deleteuser = async(req,res)=>{
    try{
        const  users = await User.deleteOne({_id:req.params.id});
        if(users){
           res.json({status:true,message:"User are Deleted Successfully",data:users});
        }
        else{
            res.json({status:false,message:"User cannot be deleted.Please try again"}); 
        }
    }
    catch(err){
        console.log(err);
        res.json({status:false,message:"Something went wrong"});
    }
}




export const AdminDashboard = async(req,res)=>{
    try{
        const  users = await User.find();
        const totaluser = users.length;
        const product = await Product.find();
        const totalproduct = product.length;
        const order = await Order.find();
        const totalorder = order.length;
        const deliver = await Order.find({orderStatus:"Delivered"});
        const orderdeliver = deliver.length;

        console.log(`totalusers:${totaluser}`);
        console.log(`totalproducts:${totalproduct}`);
        console.log(`totalorders:${totalorder}`);
        console.log(`totalorderdeliver:${orderdeliver}`);
        res.json({status:true,message:"Admin Dashboard count found Successfully",
         data:{
            totaluser,
            totalorder,
            totalproduct,
            orderdeliver
         }
       })
        
    }
    catch(err){
        console.log(err);
        res.json({status:false,message:"Something went wrong"});
    }
}