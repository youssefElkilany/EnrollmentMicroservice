import mongoose from "mongoose";

const connectDB = async ()=>{
    return await mongoose.connect().then(x=>{
        console.log("db connected");
    }).catch(err=>{
        console.log("db failed to connect")
    })
}
export default connectDB