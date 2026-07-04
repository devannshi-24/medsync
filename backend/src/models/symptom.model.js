import mongoose from "mongoose"

const symptomSchema= new mongoose.Schema({
    userId:{
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required: true
    },
    symptom: {
        type: String,
        required:true,
        trim: true,
        maxlength: 100
    },
    severity:{
        type:String,
        enum:["mild","moderate","severe"],
        required:true
    },
    notes:{
        type:String,
        trim : true,
        maxlength:300
    },
    loggedAt: {
        type: Date,
        default:Date.now
    }
},{
    timestamps:true
})


const Symptom= mongoose.model("Symptom",symptomSchema)

export default Symptom