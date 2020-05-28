import express from "express"
const server = express()
import listEndPoints from "express-list-endpoints"
import dotenv from "dotenv"
dotenv.config()
server.use(express.json())
import cors from "cors"
import  connectMongoose  from "./db/mongooseConnection"
import { UserModel } from "./model"

server.use(cors());


const PORT = process.env.PORT || 5500

server.get("/test", (req,res)=>{
res.send("Hello")
})


server.get("/test1", async(req,res)=>{
    const users =  await UserModel.find({})
     res.send(users)
     })


console.log(listEndPoints(server))

server.listen(PORT, ()=>{
    console.log(`We are live on ${PORT}`);
    connectMongoose();
})




/*

import axios from "axios"

const city= "berlin"
axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${process.env.GEO_KEY}`)
  .then(response => {
    console.log(response.data.results[0].geometry);
  }).catch(error => {
    console.log(error);
  });

  */