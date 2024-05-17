import { Router } from "express";
import * as ec from './Controller/enrollment.js'
import auth from "../../Middelware/Auth.js";
import { roles } from "../../Middelware/validation.js";
const router  = Router()

// student
router.post("/request/:courseId",auth(roles.student),ec.requestenrollment)
router.get("/studentEnroll",auth(roles.student),ec.studentEnrollment)
router.put("/cancel/:enrollmentId",auth(roles.student),ec.cancelEnrollment)

// instructor
router.get("/instructorEnroll",auth(roles.instructor),ec.instructorEnrollments)
router.post("/req/:enrollmentId",auth(roles.instructor),ec.instructorResponse)



// by admin
router.get("/all",ec.getEnrollment)

// msh ana elmfrood 23ml microservices deh b role brdo 3shan lw 7ad 3rf api deh ?
// Microservices API
router.put("/edit/:courseId/:name",ec.editEnrollmentMicro)
router.delete("/del/:courseId",ec.removeEnrollmentMicro)



export default router