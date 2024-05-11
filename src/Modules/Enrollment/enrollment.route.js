import { Router } from "express";
import * as ec from './Controller/enrollment.js'
const router  = Router()


router.get("/",ec.enrollmentc)

export default router