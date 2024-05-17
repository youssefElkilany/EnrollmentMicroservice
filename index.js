import express from "express"
import  bootstrap  from "./src/index.route.js"
import dotenv from "dotenv"
const app = express()
dotenv.config()

bootstrap(express,app)

app.listen(3000,()=>{
    console.log("server is connected")
})