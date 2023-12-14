import Product from '../Models/ProductModel.js';
import User from '../Models/userModel.js';

export const CreateProduct = async (req, res) => {
    try {
        const { ProductName, Description, Price, Category, ProductImageUrl, Quantity } = req.body;

        

        const user = await User.findById({ _id: req.user }).select('-password');

        if (!user) {
            return res.json({ status: false, message: "User not found" });
        }

        const product = await Product.create({
            ProductName: ProductName,
            Description: Description,
            Price: Price,
            ProductImageUrl: ProductImageUrl,
            Category: Category,
            Quantity: Quantity,
            CreatedBy: user 
        });
        await product.save();
        console.log(product);

        if (product) {
            return res.json({ status: true, message: "Product Created Successfully", data:product});
        } else {
            return res.json({ status: false, message: "Product cannot be created. Please try again" });
        }
    } catch (err) {
        console.log(err);
        return res.json({ status: false, message: "Something went wrong" });
    }
};

export const EditProduct = async(req,res)=>{
    try{
        
        const{ ProductName, Description, Price, Category, ProductImageUrl, Quantity} = req.body;

        const user = await User.findById({ _id: req.user }).select('-password');

        if (!user) {
            return res.json({ status: false, message: "User not found" });
        }

        const product = await Product.findOneAndUpdate({_id:req.params.id},{
            ProductImageUrl:ProductImageUrl,
            ProductName:ProductName,
            Description:Description,
            Price:Price,
            Quantity:Quantity,
            Category:Category

        },{ new: true });
        product.CreatedBy = user;
        product.updatedAt = Date.now();
        await product.save();
        console.log(product);
        if(product){
            res.json({status:true,message:"Product Updated Successfully",data:product})
        }
        else{
            res.json({status:false,message:"Product cannot be updated. Please try again"});
        }
    }
    catch(err){
        console.log(err);
        res.json({status:false,message:"Something went wrong"});
    }
}


export const ViewProduct = async(req,res)=>{
    try{
        const product = await Product.findOne({_id:req.params.id});
        if(product){
            res.json({status:true,message:"Product Viewed Successfully",data:product})
        }
        else{
            res.json({status:false,message:"Product cannot be viewed. Please try again!!! "})
        }
    }
    catch(err){
        console.log(err);
        res.json({status:false,message:"Something went wrong"});
    }
}

export const DeleteProduct = async(req,res)=>{
    try{
        const product = await Product.findOneAndDelete({_id:req.params.id});
        if(product){
            res.json({status:true,message:"Product Deleted Successfully",data:product})
        }
        else{
            res.json({status:false,message:"Product cannot be deleted. Please try again!!! "})
        }
    }
    catch(err){
        console.log(err);
        res.json({status:false,message:"Something went wrong"});
    }
}

export const SearchProduct = async (req, res) => {
    try {
      const { ProductName, Category } = req.query;
  
      // Construct query based on provided parameters
      const query = {};
  
      if (ProductName) {
        query.ProductName = { $regex: new RegExp(ProductName, 'i') };
      }
  
      if (Category) {
        query.Category = { $regex: new RegExp(Category, 'i') };
      }
  
      // Find products that match the query
      const products = await Product.find(query);
  
      console.log(products);
  
      if (products.length > 0) {
        res.json({ status: true, message: "Search Product Successfully", data: products });
      } else {
        res.json({ status: false, message: "No products found matching the search criteria" });
      }
    } catch (err) {
      console.error(err);
      res.json({ status: false, message: "Something went wrong" });
    }
  };
  
  

export const AllProduct = async(req,res)=>{
    try{
        const products = await Product.find();
        console.log(products);
        if(products){
            res.json({status:true,message:"All Products found Successfully",data:products});  
        }
        else{
            res.json({status:false,message:"Product list cannot be found. Please try again!!! "})
        }
    }
    catch(err){
        console.log(err);
        res.json({status:false,message:"Something went wrong"});
    }
}



