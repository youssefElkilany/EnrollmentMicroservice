import { Schema,Types,model } from "mongoose";

const enrollmentSchema  = new Schema({
    courseId:{type:Types.ObjectId,required:true}, // ref
    instructorId:{type:Number,required:true},
    courseName:{type:String,required:true},
    studentId:{type:Number,required:true},
    status:{type:String,default:"requested",Enum:['requested','accepted','rejected','cancelled']},

},{
    timestamps:true
})

const enrollmentModel = model('Enrollment',enrollmentSchema)
export default enrollmentModel