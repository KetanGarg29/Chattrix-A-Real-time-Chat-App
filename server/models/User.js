import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {type:String, required:true, unique:true },
    fullName : {type:String, required:true},
    password : {type:String, required:true, minLength:6 },
    profilePic : {type:String, default:"" },
    bio : {type:String},
}, {timestamps: true});


//Creating User 
const User = mongoose.model("User",userSchema);

//exporting user schema to use it in another file 
export default User;