import mongoose from "mongoose"

const medicinesSchema= new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    name:{
        type:String,
        required:true,
    },
    purpose:{
        type:String,
    },
    notes:String,
    isDeleted:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
})

const Medicine= mongoose.model("Medicine",medicinesSchema)

export default Medicine