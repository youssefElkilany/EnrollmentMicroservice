import axios, { all } from "axios";
import enrollmentModel from "../../../../DB/enrollmentModel.js";
import sendEmail from "../../../Utils/sendEmail.js";

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
    const {courseId,instructorId} = req.params
    const {id} = req.user

    const userResponse = await axios.get(`http://localhost:5000/courses/publishedCourses`);
    //  console.log({userResponse})
    //  console.log({headersss:userResponse.headers})
    console.log({data:userResponse.data})
   const data = userResponse.data
   if(data.courses.length <= 0)
    {
        return res.json("no courses available")
    }
    let flag = false
    let course = {}
    for (const obj of data.courses) {
        if( courseId == obj._id  && obj.published == false)
            {
                course = obj
                console.log({course});
                flag = true
                break
            }
    }

    if(!flag)
        {
            return res.json("course not found")
        }

        const findEnrollment = await enrollmentModel.findOne({instructorId:course.instructorId,studentId:req.user.id,courseName:course.name})
        if(findEnrollment)
            {
                if(findEnrollment.status == "requested")
                    {
                        return res.json("u alreadyy have requested")
                    }
                    else if(findEnrollment.status == "Accepted")
                        {
                            return res.json("instructor accepted your request")
                        }
                        else if(findEnrollment.status == "rejected")
                            {
                                return res.json("instructor rejected your request")
                            }
                            else if(findEnrollment.status == "cancelled")
                                {
                                    findEnrollment.status = "requested"
                                    findEnrollment.save()
                                    return res.json("request sent successfully")
                                }
            }
            console.log({courseId:course._id,courseName:course.name,instructorId:course.instructorId,StudentId:Number(req.user.id)});
            const createCourse = await enrollmentModel.create({courseId:course._id,courseName:course.name,instructorId:course.instructorId,studentId:req.user.id})
            if(!createCourse)
                {
                    return res.json("nothing added")
                }

                return res.json("added successfully")
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
            if(getEnrollment.status == "cancelled")
                {
                    return res.json("already cancelled")
                }
                // if(getEnrollment.status == "requested")
                //     {
                //         return res.json("u must wait for instructor response") // lazem n3ml handle lel case deh
                //     }
                // lw student requested yt3mlha cancel 3ady

    const updateEnrollment = await enrollmentModel.findOneAndUpdate({_id:enrollmentId,studentId:id},{status:"cancelled"},{new:true}) // 3ayzeen ngrb hena lw 3mlt check b3d update hy7sl wla hy3ml update el2wl b3deha y3ml check
    if(!updateEnrollment)
        {
            return res.json("nothing updated")
        }
       // sendEmail() eno cancel enrollment

        // h2ll hena enrolledStudents fel course
return res.json({MSG:"all enrollment",updateEnrollment})

}
//by students
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

    const findEnrollment = await enrollmentModel.findOne({_id:enrollmentId})
    if(!findEnrollment)
        {
            return res.json("not enrollment found")
        }
        if(findEnrollment.status == "cancelled")
            {
                return res.json(`cant be ${status} ,student already cancelled enrollment`)
            }
        

       const updateEnrollment = await enrollmentModel.findByIdAndUpdate({_id:enrollmentId},{status},{new:true})
       if(!updateEnrollment)
        {
            return res.json("not enrollment updated")
        }
        if(status == "accepted")
            {
                //hazawd enrollmentStudent fel course
            }

           // sendEmail()

        // hb3t email lel student
        return res.json("updated successfully")
}


export const instructorEnrollments = async(req,res,next)=>{

    const {id} = req.user

    const allEnrollment = await enrollmentModel.find({instructorId:id})
    if(!allEnrollment)
        {
            return res.json("no enrollment found")
        }

        return res.json({"Enrollments":allEnrollment})
}