import Profile from "../models/profile.model.js"

export const getProfile= async (req,res)=>{
    try{
        const profile= await Profile.findOne({userId: req.user._id})

        if(!profile){
            return res.status(404).json({message:"Profile not found"})
        }

        res.status(200).json({profile},{message:"Profile fetched successfully"})

    }catch(err){
        res.status(500).json({message:"cannot fetch profile",error:err.message})
    }
}

export const updateProfile= async(req,res)=>{
    try{
        const user = req.user
        const {age,gender,weight,height,chronicConditions,allergies}= req.body;
        
        const profile = await Profile.findOneAndUpdate({userId: user._id},{
            $set:{
                age,
                gender,
                weight,
                height,
                chronicConditions,
                allergies
            }
        },{new:true})

        if(!profile){
            return res.status(404).json({message:"Profile not found"})
        }
        res.status(200).json({profile,message:"Profile updated successfully"})

    }catch(err){
        res.status(500).json({message:"Cannot update profile",error:err.message})
    }
}