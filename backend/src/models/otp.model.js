import mongoose from "mongoose"

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true

    },
    otp:{
        type:String,
        required:true
    },
    purpose:{
        type:String,
        enum:["signup","reset-password"],
        required:true
    },
    name:{
        type:String,
    },
    password:{
        type:String,
    },
    expiresAt: {
    type: Date,
    required: true,
    expires: 0
}
    

},{timestamps:true})

const OTP= mongoose.model("OTP",otpSchema)

export default OTP
