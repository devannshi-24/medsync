import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";



const PORT= process.env.PORT
 
import { app } from "./app.js";


connectDB();



app.listen(PORT,()=>{
    console.log("Server is running on port ",PORT);
})
