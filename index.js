import express from "express"
import  bootstrap  from "./src/index.route.js"
const app = express()


bootstrap(express,app)

app.listen(3000,()=>{
    console.log("server is connected")
})