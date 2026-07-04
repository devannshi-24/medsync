import Medicine from "../models/medicine.model.js"
import Schedule from "../models/schedule.model.js"

export const addMedicine= async(req,res)=>{
    try{
        const user= req.user

        const {name,purpose,notes}= req.body;

        const medicine= new Medicine({
            userId:user._id,
            name,
            purpose,
            notes
        })
        await medicine.save();

        res.status(201).json({medicine,message:"Medicine added successfully"})
    }
    catch(err){
        res.status(500).json({message:"error while adding medicine",error:err.message})
    }
}

export const getMedicines= async(req,res)=>{
    try{
        const user= req.user

        const medicines= await Medicine.find({userId:user._id,
          isDeleted:false  
        }
    )
        res.status(200).json({medicines,message:"Medicines fetched successfully"})
    }
    catch(err){
        res.status(500).json({message:"error while fetching medicines",error:err.message})
    }
}

export const getMedicineById= async(req,res)=>{
    try{
        const user= req.user
        const medicineId= req.params.id

        const medicine= await Medicine.findOne({
            _id:medicineId,
             userId:user._id,
              isDeleted:false
            }
        )
        if(!medicine){
            return res.status(404).json({message:"Medicine not found"})
        }
        res.status(200).json({medicine,message:"Medicine fetched successfully"})
    }
    catch(err){
        res.status(500).json({message:"error while fetching medicine",error:err.message})
    }
}

export const deleteMedicine= async(req,res)=>{
    try{
        const user= req.user
        const medicineId= req.params.id

        const medicine= await Medicine.findOne({userId:user._id,_id:medicineId})

        if(!medicine){
            return res.status(404).json({medicine,message:"Medicine not found"})
        }

        //soft delete medicine
        medicine.isDeleted=true
        await medicine.save()

        //deactivate all related schedules
        await Schedule.updateMany({
            medicineId:medicine._id
        },
        {
            $set:{
                isActive:false
            }
        }
    )

        res.status(200).json({medicine,message:"Medicine deleted successfully"})
    }
    catch(err){
        res.status(500).json({message:"error while deleting medicine",error:err.message})
    }
}

export const updateMedicine = async(req,res)=>{
    try{
        console.log("Update route hit");
        console.log(req.params.id);
        console.log(req.user);
        const user= req.user
        const medicineId= req.params.id
        const {name,purpose,notes}= req.body

        const medicine= await Medicine.findOneAndUpdate({_id:medicineId, userId:user._id},{
            $set:{
                name,
                purpose,
                notes
            }
        },{new:true})
        if(!medicine){
            return res.status(404).json({message:"Medicine not found"})
        }
        res.status(200).json({medicine,message:"Medicine updated successfully"})
    }catch(err){
        res.status(500).json({message:"error while updating medicine",error:err.message})
    }
}