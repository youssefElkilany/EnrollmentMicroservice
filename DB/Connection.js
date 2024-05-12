import mongoose from 'mongoose'
const connectDB  = async ()=>{
   // console.log(process.env.DB_LOCAL);
    return await mongoose.connect("mongodb+srv://youssef:course@atlascluster.u4xyne2.mongodb.net/Enrollment")
    .then(res=>console.log(`DB Connected successfully on .........`))
    .catch(err=>console.log(` Fail to connect  DB.........${err} `))
}


export default connectDB;