import { genrateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"; 

//singning up new user
export const signup = async (req,res)=>{
    const{fullName, email, password, bio} = req.body;
    try {
        //IF ANY OF THE DETAIL IS MISSING, WE CANNOT SIGNUP
        if(!fullName || !email  || !password || !bio){
            return res.json({success:false, message:"Misiing Details"})
        }
        //IF EVERY DETAIL IS OK, WE CHECK WHETHER THE USER WITH SAME EMAIL IS ALREADY HERE OR NOT
        const user = await User.findOne({email});
        //IF USER FOUND
        if(user){
            return res.json({success:false, message:"User with this email already exist"})
        }
        //IN DB we will not store orig. pass., instead we will hash it
        //for hashing we will generate salt using bcrypt.js library

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //now creating new user
        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        });

        //now generating token, hume token bar bar genrate
        // krna pdega toh uska function bna diya hai utils.js mai
        const token = genrateToken(newUser._id)
        res.json({success:true, userData: newUser, token, message:"Account Created Successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}


//Now, Controller to login a user
export const login = async(req,res)=>{
    try {
        const {email, password} = req.body;
        const userData =  await User.findOne({email})
        const isPassword = await bcrypt.compare(password,userData.password);
        if(!isPassword){
            return res.json({success:false, message:"Invalid Credentials"})
        }
        const token = genrateToken(userData._id)
        res.json({success:true, userData, token, message:"Login Successful"})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}



///Controller to check whether the user is authenticated
export const checkAuth = (req,res)=>{
    res.json({success: true, user: req.user});
}

//Controller to update user profile details
export const updateProfile = async (req,res)=>{
    try {
        const {profilePic, bio, fullName} = req.body;
        const userId = req.user._id;
        let updatedUser;
        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, {bio,fullName}, {new:true});
        }
        else{
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, {profilePic:upload.secure_url, bio, 
                fullName}, {new:true});
        }
        res.json({success:true, user: updatedUser})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}