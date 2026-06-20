import mongoose from "mongoose"

const doseLogSchema= new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    scheduleId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Schedule",
        required:true
    },
    status:{
        type:String,
        enum:["taken","missed"],
        required:true
    },
    loggedAt:{
        type:Date,
        default:Date.now
    }   
},{timestamps:true})

const DoseLog= mongoose.model("DoseLog",doseLogSchema)

export default DoseLog