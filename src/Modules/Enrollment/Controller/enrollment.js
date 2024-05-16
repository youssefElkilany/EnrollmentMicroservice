import axios, { all } from "axios";
import enrollmentModel from "../../../../DB/enrollmentModel.js";
import sendEmail from "../../../Utils/sendEmail.js";
import mongoose from "mongoose";

// as student
// export const requestenrollment = async(req,res,next)=>{
//     const {courseId,instructorId} = req.params
//     const {id} = req.user

//     const userResponse = await axios.get(`http://localhost:5000/courses/publishedCourses`);
//     //  console.log({userResponse})
//     //  console.log({headersss:userResponse.headers})
//     console.log({data:userResponse.data})
//    const data = userResponse.data
//    if(data.courses.length <= 0)
//     {
//         return res.json("no courses available")
//     }
//     let flag = false
//     let course = {}
//     for (const obj of data.courses) {
//         if( courseId == obj.id  && obj.published == true)
//             {
//                 course = obj
//                 flag = true
//                 break
//             }
//     }

//     if(!flag)
//         {
//             return res.json("course not found")
//         }

//         const findEnrollment = await enrollmentModel.findOne({instructorId:course.instructorId,StudentId:req.user.id,courseName:obj.name})
//         if(findEnrollment)
//             {
//                 if(findEnrollment.status == "requested")
//                     {
//                         return res.json("u alreadyy have requested")
//                     }
//                     else if(findEnrollment.status == "Accepted")
//                         {
//                             return res.json("instructor accepted your request")
//                         }
//                         else if(findEnrollment.status == "rejected")
//                             {
//                                 return res.json("instructor rejected your request")
//                             }
//                             else if(findEnrollment.status == "cancelled")
//                                 {
//                                     findEnrollment.status = "requested"
//                                     findEnrollment.save()
//                                     return res.json("request sent successfully")
//                                 }
//             }

//             const createCourse = await enrollmentModel.create({courseId:course._id,courseName:course.name,instructorId:course.instructorId,StudentId:req.user.id})
//             if(!createCourse)
//                 {
//                     return res.json("nothing added")
//                 }

//                 return res.json("added successfully")
// }

export const requestenrollment = async(req,res,next)=>{
    const {courseId} = req.params
    const {id} = req.user

    const userResponse = await axios.get(`http://localhost:5000/courses/publishedCourses`);
    //  console.log({userResponse})
    //  console.log({headersss:userResponse.headers})
    // console.log({courseId})
    // console.log({data:userResponse.data})
   const data = userResponse.data
   if(data.courses.length <= 0)
    {
        return res.json("no courses available")
    }
    let flag = false
    let course = {}
    for (const obj of data.courses) {
       
        if( courseId == obj._id  && obj.published == true)
            {
                course = obj
                console.log({course});
                flag = true
                break
            }
    }

    if(!flag)
        {
            return res.json({MSG:"course not found"})
        }

        if(course.enrolledStudents == course.capacity)
            {
                return res.json({MSG:"course is reserved , no place for more"})
            }

        const findEnrollment = await enrollmentModel.findOne({instructorId:course.instructorId,studentId:req.user.id,courseName:course.name})
        if(findEnrollment)
            {
                if(findEnrollment.status == "requested")
                    {
                        return res.json({MSG:"u alreadyy have requested"})
                    }
                    else if(findEnrollment.status == "Accepted")
                        {
                            return res.json({MSG:"instructor already accepted your request"})
                        }
                        else if(findEnrollment.status == "rejected")
                            {
                                findEnrollment.status = "requested"
                                findEnrollment.save()
                                return res.json({MSG:"request sent successfully"})
                            }
                            else if(findEnrollment.status == "cancelled")
                                {
                                    findEnrollment.status = "requested"
                                    findEnrollment.save()
                                    return res.json({MSG:"request sent successfully"})
                                }
            }
            console.log({courseId:course._id,courseName:course.name,instructorId:course.instructorId,StudentId:Number(req.user.id)});
            const createCourse = await enrollmentModel.create({courseId:course._id,courseName:course.name,instructorId:course.instructorId,studentId:req.user.id})
            if(!createCourse)
                {
                    return res.json("nothing added")
                }

                return res.json({MSG:"added successfully"})
}


export const cancelEnrollment = async(req,res,next)=>{

    const {enrollmentId} = req.params
    const {id} = req.user

    const getEnrollment = await enrollmentModel.findById(enrollmentId)
    if(!getEnrollment)
        {
            return res.json("no enrollment found")
        }
        if(getEnrollment.status == "cancelled")
            {
                return res.json("already cancelled")
            }
            if(getEnrollment.status == "rejected")
                {
                    return res.json("already rejected by instructor")
                }
                let flag = true
                if(getEnrollment.status == "requested")
                    {
                        flag = false // lazem n3ml handle lel case deh
                    }
                // lw student requested yt3mlha cancel 3ady

    const updateEnrollment = await enrollmentModel.findOneAndUpdate({_id:enrollmentId,studentId:id},{status:"cancelled"},{new:true}) // 3ayzeen ngrb hena lw 3mlt check b3d update hy7sl wla hy3ml update el2wl b3deha y3ml check
    if(!updateEnrollment)
        {
            return res.json("nothing updated")
        }
        if(flag)
            {
                axios.post(`http://localhost:5000/courses/enrolledNum`,{courseId:new mongoose.Types.ObjectId(getEnrollment.courseId)})
            }
       // sendEmail() eno cancel enrollment
    //    sendEmail({to:req.user.email,subject:"enrollment cancellation",html:`<a href = u have cancelled ur enrollment of course </a>
    //    <br>`})

        // h2ll hena enrolledStudents fel course
return res.json({MSG:"enrollment cancelled"})

}


export const studentEnrollment = async(req,res,next)=>{

    const {id} = req.user

    const allEnrollment = await enrollmentModel.find({studentId:id})
    if(!allEnrollment)
        {
            return res.json("no enrollment found")
        }

        return res.json({"Enrollments":allEnrollment})
}


//by admin
export const getEnrollment = async(req,res,next)=>{

    const allEnrollment = await enrollmentModel.find()
    if(!allEnrollment)
        {
            return res.json("no enrollment found")
        }

        return res.json({MSG:"Enrollments",allEnrollment})
}

// for instructor

export const instructorResponse = async (req,res,next)=>{
   // const {id} = req.user
    const {enrollmentId} = req.params
    const {status} = req.body

    const findEnrollment = await enrollmentModel.findOne({_id:enrollmentId,instructorId:req.user.id}) // hazawd hena check 3la instructorID
    if(!findEnrollment)
        {
            return res.json({MSG:"not enrollment found"})
        }
        if(findEnrollment.status == "cancelled")
            {
                return res.json({MSG:`can't be ${status} ,student already cancelled enrollment`})
            }
            if(findEnrollment.status == "accepted")
                {
                    return res.json({MSG:`can't be ${status} ,u already accepted before`})
                }
        

       const updateEnrollment = await enrollmentModel.findByIdAndUpdate({_id:enrollmentId},{status},{new:true})
       if(!updateEnrollment)
        {
            return res.json("not enrollment updated")
        }
        if(status == "accepted")
            {
                
           const respone = await axios.post(`http://localhost:5000/courses/enrolledNum2`,{courseId:new mongoose.Types.ObjectId(findEnrollment.courseId)})
        //    .then(x=>{
        //     return res.json("gg")
        //    }).catch(err =>{
        //     console.log(`err is ${err}`)
        //     return res.json(`err is ${err}`);
        //    })
                //hazawd enrollmentStudent fel course
            }

        //     const userResponse = await axios.get(`http://127.0.0.1:8081/ejb8-1.0-SNAPSHOT/api/auth/Accounts`)
        // const data = userResponse.data

        // let flag = false
        // let user = {}
        // for (const obj of data) { // nzwd users ganb create
        //     console.log({obj});
        //     if(findEnrollment.studentId == obj.id)
        //         {
        //             user = obj
        //             console.log({user});
        //             flag = true
        //             break
        //         }
        // } 
        // if(!flag)
        //     {
        //         return res.json("id not found")
        //     }

            // sendEmail({to:user.email,subject:"enrollment respone",html:`<a instructor have ${status} your request </a>
            // <br>`})

           // sendEmail()

        // hb3t email lel student
        return res.json({MSG:"updated successfully"})
}


// export const instructorResponse = async (req, res, next) => {
//     const { enrollmentId } = req.params;
//     const { status } = req.body;

//     try {
//         const findEnrollment = await enrollmentModel.findById(enrollmentId);
//         if (!findEnrollment) {
//             return res.status(404).json("Enrollment not found");
//         }
        
//         if (findEnrollment.status === "cancelled") {
//             return res.status(400).json(`Cannot update status, enrollment is already cancelled`);
//         }

//         const updateEnrollment = await enrollmentModel.findByIdAndUpdate(enrollmentId, { status }, { new: true });
//         if (!updateEnrollment) {
//             return res.status(500).json("Failed to update enrollment status");
//         }

//         if (status === "accepted") {
//             console.log({courseID:findEnrollment.courseId});
//             const response = await axios.put(`http://localhost:5000/courses/enrolledNum`, { courseId:mongoose.Types.ObjectId(findEnrollment.courseId) });
//             if (response.status !== 200) {
//                 throw new Error(`Failed to update enrolled number for course`);
//             }
//         }

//         console.log({courseID:findEnrollment.courseId});
//         const userResponse = await axios.get(`http://127.0.0.1:8081/ejb8-1.0-SNAPSHOT/api/auth/Accounts`);
//         const data = userResponse.data;
//         console.log({courseID:findEnrollment.courseId});
//         let flag = false;
//         let user = {};
//         for (const obj of data) { // azwd hena users
//             if (findEnrollment.studentId == obj.id) {
//                 user = obj;
//                 flag = true;
//                 break;
//             }
//         }
//         if (!flag) {
//             return res.status(404).json("User not found");
//         }

//         // Send email to the student
//         // sendEmail({to: user.email, subject: "Enrollment response", html: `<p>Your enrollment request has been ${status} by the instructor.</p>`});

//         return res.json("Updated successfully");
//     } catch (error) {
//         console.error("Error in instructorResponse:", error.message);
//         return res.status(500).json(`Internal Server Error: ${error.message}`);
//     }
// };


export const instructorEnrollments = async(req,res,next)=>{

    const {id} = req.user

    const allEnrollment = await enrollmentModel.find({instructorId:id})
    if(!allEnrollment)
        {
            return res.json("no enrollment found")
        }

        return res.json({"Enrollments":allEnrollment})
}