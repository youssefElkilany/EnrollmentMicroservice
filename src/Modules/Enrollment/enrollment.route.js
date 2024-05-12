import { Router } from "express";
import * as ec from './Controller/enrollment.js'
import auth from "../../Middelware/Auth.js";
import { roles } from "../../Middelware/validation.js";
const router  = Router()


router.post("/",auth(roles.student),ec.requestenrollment)
router.get("/allEnrollment",ec.getEnrollment)
router.put("/cancel/:enrollmentId",auth(roles.student),ec.cancelEnrollment)

export default router