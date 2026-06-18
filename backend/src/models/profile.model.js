import mongoose from "mongoose";

const profileSchema =new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    age:{
        type:Number,      
    },
    gender:{
        type:String,
        enum:["male","female","other"]
    },
    weight:Number,
    height:Number,
    chronicConditions:[String],
    allergies:[String],
    timezone:{
        type:String,
        default:"Asia/Kolkata"
    }

},{timestamps:true});

 const Profile = mongoose.model("Profile",profileSchema);

export default Profile