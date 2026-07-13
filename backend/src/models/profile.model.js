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
        min:0,
        max:150, 
    },
    gender:{
        type:String,
        enum:["male","female","other"]
    },
    weight:{
        type:Number,
        min:1,
        max:500,
    },
    height:{
        type:Number,
        min:30,
        max:300,
    },
    chronicConditions:[String],
    allergies:[String],
    timezone:{
        type:String,
        default:"Asia/Kolkata"
    }

},{timestamps:true});

 const Profile = mongoose.model("Profile",profileSchema);

export default Profile