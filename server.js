import express from "express"
const server = express()
import listEndPoints from "express-list-endpoints"
import dotenv from "dotenv"
dotenv.config()
server.use(express.json())
import cors from "cors"

import  connectMongoose  from "./db/mongooseConnection"


server.use(cors());


const PORT = process.env.PORT || 5500

server.get("/home", (req,res)=>{
res.send("Hello")
})

console.log(listEndPoints(server))

server.listen(PORT, ()=>{
    console.log(`We are live on ${PORT}`);
    connectMongoose();
})



