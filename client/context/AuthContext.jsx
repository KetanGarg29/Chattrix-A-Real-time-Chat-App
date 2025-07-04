import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {io} from "socket.io-client"
import axios from "axios"	

const backendurl = import.meta.env.VITE_API_BASE;
axios.defaults.baseURL = backendurl;

export const AuthContext = createContext();


export const AuthProvider = ({children})=>{

    const[token,setToken] = useState(localStorage.getItem("token"));
    const[authUser,setAuthUser] = useState(null);
    const[onlineUsers,setOnlineUsers] = useState([]);
    const[socket,setSocket] = useState(null);

    const checkAuth = async() =>{
        try {
            const { data } = await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const login =async (state,credentials)=>{
        try {
            const {data} = await axios.post(`/api/auth/${state}`,credentials);
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token",data.token)
                toast.success(data.message)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


//FUNCTION FOR USER LOGOUT AND SOCKET DISCONNECTION
    const logout = async()=>{
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("logged out successfully")
        socket.disconnect();
    }


    //UPDATE PROFILE FUNCTION TO HANDLE PROFILE UPDATES
    const updateProfile = async (body)=>{
        try {
            const {data} = await axios.put("/api/auth/update-profile",body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile Updated Successfully")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    //connect socket function to handle socket connection and online user update
    const connectSocket = (userData)=>{
        if(!userData || socket?.connected) return;
        const newSocket = io(backendurl, {
            query:{
                userId : userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers",(userIds)=>{
            setOnlineUsers(userIds);
        })
    }

    useEffect(()=>{
        if(token){
            console.log("token s: ",token);
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth();
    },[])
    
    //check if user is authenticated or not, and if set the user data and connect the socket 

    const value ={
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}


