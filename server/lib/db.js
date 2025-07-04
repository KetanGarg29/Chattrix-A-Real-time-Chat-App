import mongoose from "mongoose";

//below is the function to connect to the database
export const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected', ()=>console.log("Database Connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    } catch (error) {
        console.log(error);
    }
}