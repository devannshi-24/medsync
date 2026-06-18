import mongoose from "mongoose";    
import jwt from "jsonwebtoken";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    role:{
        type:String,
        enum:['patient','doctor','admin'],
        default:'patient'
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

userSchema.methods.generateAuthToken= function(){
    const token= jwt.sign({_id:this._id,role:this.role},process.env.JWT_SECRET,{expiresIn:'2d'})
    return token;
}



const User =mongoose.model("User",userSchema);

export default User



