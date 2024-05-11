import axios from "axios";

export const enrollmentc = async(req,res,next)=>{

    const userResponse = await axios.get(`http://localhost:5000/courses`);
     console.log({userResponse})
     console.log({headersss:userResponse.headers})
    // userResponse.data
    return res.json(userResponse.data)
}