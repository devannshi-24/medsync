import Medicine from "../models/medicine.model.js";
import Schedule from "../models/schedule.model.js";
import DoseLog from "../models/doselog.model.js";

export const getDashboard= async(req,res)=>{
    try {
        const user= req.user;
        const [
            totalMedicines,
            activeSchedules,
            totalDoses,
            takenDoses,
            missedDoses,
            recentLogs
        ]= await Promise.all([
            Medicine.countDocuments(
                {
                    userId:user._id
                }
            ),
            Schedule.countDocuments({
                userId:user._id,
                isActive:true,
                endDate:{$gte:new Date()}
            }),
            DoseLog.countDocuments({
                userId:user._id
            }),
            DoseLog.countDocuments({
                userId:user._id,
                status:"taken"
            }),
            DoseLog.countDocuments({
                userId:user._id,
                status:"missed"
            }),
            DoseLog.find({userId:user._id})
            .select("status loggedAt scheduleId")
            .sort({createdAt:-1})
            .limit(5)
            .populate({
                path:"scheduleId",
                select: "medicineId dosage frequency times",
                populate:{
                    path: "medicineId",
                    select: "name"
                }
            })
        ])

        const adherenceScore= totalDoses===0?0: Math.round((takenDoses/totalDoses)*100)

        const schedules= await Schedule.find({
            userId:user._id,
            isActive:true,
            startDate:{$lte: new Date()},
            endDate:{$gte: new Date()}
        }).populate("medicineId","name")

        const today= new Date()
        today.setHours(0,0,0,0)

        const todaySchedules= schedules.filter(schedule=>{
            if(schedule.frequency==="daily"){
                return true;
            }

            if(schedule.frequency==="alternate"){
                const startDate= new Date(schedule.startDate)
                startDate.setHours(0,0,0,0)

                const diffDays= Math.floor(
                    (today-startDate)/(1000*60*60*24)
                )

                return diffDays %2 === 0;

            }
            if(schedule.frequency==="weekly"){
                const startDate= new Date(schedule.startDate)
                startDate.setHours(0,0,0,0)

                return today.getDay()===startDate.getDay()
            }
        })

        const todaySchedulesData= todaySchedules.map(schedule=>({
            medicine: schedule.medicineId?.name,
            dosage: schedule.dosage,
            frequency:schedule.frequency,
            times: schedule.times
        }))

         const todaySchedulesCount= todaySchedules.length 

        const recentActivity= recentLogs.map(log=>({
            medicine: log.scheduleId?.medicineId?.name,
            status: log.status,
            loggedAt: log.loggedAt
        }))


        // weekly stats
        const sevenDaysAgo= new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate()-7)

        const totalWeeklyDoses= await DoseLog.countDocuments({
            userId:user._id,
            loggedAt:{$gte:sevenDaysAgo}
        })
        const weeklyTakenDoses= await DoseLog.countDocuments({
            userId:user._id,
            status:"taken",
            loggedAt:{$gte:sevenDaysAgo}
        })

        const weeklyMissedDoses= await DoseLog.countDocuments({
            userId:user._id,
            status:"missed",
            loggedAt:{$gte:sevenDaysAgo}
        })

        const weeklyAdherenceScore= totalWeeklyDoses===0?0: Math.round((weeklyTakenDoses/totalWeeklyDoses)*100)


       
    
        res.status(200).json({
            stats:{
                totalMedicines,
                totalDoses,
                takenDoses,
                missedDoses,
                activeSchedules,
                todaySchedulesCount,
                adherenceScore
            },
            weeklyStats:{
                weeklyTakenDoses,
                weeklyMissedDoses,
                weeklyAdherenceScore,
            },
            recentActivity,
            todaySchedules:todaySchedulesData
        })
    } catch (err) {
        res.status(500).json({message:"can't fetch dashboard",error:err.message})
    }
}