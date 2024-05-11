import enrollmentRouter from "../src/Modules/Enrollment/enrollment.route.js"
//import cors from "cors"
 const bootstrap = (express ,app)=>{

  //  app.use(cors())
    app.use(express.json())
    app.use("/enrollment",enrollmentRouter)
}

export default bootstrap