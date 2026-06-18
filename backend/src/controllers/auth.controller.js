import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Profile from '../models/profile.model.js'

export const register = async (req,res)=>{
    try{
        const {name,email,password,role}= req.body;
        // Check if user already exists
        const alreadyExists= await User.findOne({email})
        if(alreadyExists){
            return res.status(400).json({message:"User already exists"})
        }

        // Hash password
        const hashedPassword= await bcrypt.hash(password,10);
        const user= new User({name,email,password:hashedPassword,role});

        await user.save();
        await Profile.create({userId:user._id})
        const token= await user.generateAuthToken();
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:2*24*60*60*1000,
            sameSite:"strict",
            secure:false
        });
        res.status(201).json({user, token, message:"User registered successfully"})
    
    }
    catch(err){
        res.status(500).json({message:"Server error",error:err.message})
    }
}

export const login= async(req,res)=>{
    try{
        const {email,password}= req.body;
        const user= await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const token= user.generateAuthToken();
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:2*24*60*60*1000,
            sameSite:"strict",
            secure:false
        })
        res.status(200).json({user, token, message:"Login successful"})
    }
    catch(err){
        res.status(500).json({message:"Server error",error:err.message})
    }
}

export const logout= async(req,res)=>{
    try{
        res.clearCookie("token",{
            httpOnly:true,
            sameSite:"strict",
            secure:false
        })
        res.status(200).json({message:"Logout successful"})
    }
    catch(err){
        res.status(500).json({message:"Server error",error:err.message})
    }
}