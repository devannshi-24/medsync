import mongoose from "mongoose"

const scheduleSchema= new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    medicineId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Medicine",
        required:true
     },
    dosage:{
        type:String,
        required:true,
        trim:true,
        maxlength:50
    },
    frequency:{
        type:String,
        enum:["daily","weekly","alternate"],
        required:true,
        default:"daily"
    },
    times: {
    type: [String],
    required: true,
    validate: {
        validator: function(arr) {
            return arr.length > 0 &&
                   arr.every(time =>
                      /^([01]\d|2[0-3]):([0-5]\d)$/.test(time)
                   );
        },
        message: "Times must be in HH:MM format"
    }
   },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
 },
     {timestamps:true}
)

const Schedule= mongoose.model("Schedule",scheduleSchema)

export default Schedule 