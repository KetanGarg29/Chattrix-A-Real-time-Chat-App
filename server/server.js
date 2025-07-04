import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import { Socket } from "dgram";

//creating express app
const app = express();
//using this createserver because socket.io support this
const server = http.createServer(app);

//MIDDLEWARE SETUP
app.use(express.json({limit: "4mb"}));
//maximum 4mb files can be uploaded

//Initialising socket.io server
export const io = new Server(server, {
    cors: {
        origin: "https://your-client-app.onrender.com",
        methods: ["GET", "POST"],
        credentials: true
    }
});


//Store online users {userId, socketId}
export const userSocketMap = {};

//socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("user connected", userId);

    if(userId) userSocketMap[userId] = socket.id;

    //emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})



app.use(cors({
    origin: 'https://your-client-app.onrender.com',
    credentials:true
}));
//help us to connect all the URL to our backend


//ROUTES SETUP
app.use("/api/status",(req,res)=>(
    res.send("Server is live")
));

app.use("/api/auth",userRouter);
app.use("/api/messages", messageRouter);



//CONNECTING TO DATABSE
await connectDB();


const port = process.env.PORT || 5000;
//if port is available in evironment variable that will be used, otherwise 5000 will be used

server.listen(port,()=>console.log("Server is listening on the port: "+port));