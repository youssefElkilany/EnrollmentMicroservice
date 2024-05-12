import jwt from "jsonwebtoken";
import axios from "axios";
//import userModel from "../../DB/model/User.model.js";


import crypto from 'crypto'

function verifyToken(token, secretKey) {
    // Split the token into its components
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    // Decode the header and payload
    const decodedHeader = Buffer.from(encodedHeader, 'base64').toString('utf-8');
    const decodedPayload = Buffer.from(encodedPayload, 'base64').toString('utf-8');

    // Recreate the signature using the header and payload
    const data = `${encodedHeader}.${encodedPayload}`;
    const recreatedSignature = crypto.createHmac('sha256', secretKey).update(data).digest('base64');

    // Compare the recreated signature with the provided signature
    if (signature === recreatedSignature) {
        // If signatures match, return the decoded payload
        return JSON.parse(decodedPayload);
    } else {
        // If signatures don't match, token is invalid
        console.error('Token verification failed: Invalid signature');
        return null;
    }
}

// Example usage
// const secretKey = 'secret';
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJleHAiOjE3MTU1MTI1Mzc5MTd9.vXUVMweWLHAs22dQSNypaANsgQTos4DcpI3S7PzLkLI=';

// const payload = verifyToken(token, secretKey);
// if (payload) {
//     console.log('Payload:', payload);
// } else {
//     console.log('Token verification failed.');
// }



const auth = (roles=[])=> {

    return async (req, res, next) => {
  //  try {
        const { authorization } = req.headers;
       // console.log({auth:JSON.parse(authorization)});
        if (!authorization?.startsWith("hamada")) {
            return res.json({ message: "In-valid bearer key" })
        }
        const token = authorization.split("hamada")[1]
        if (!token) {
            return res.json({ message: "In-valid token" })
    
        }
        console.log(authorization);
        // const decoded = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJleHAiOjE3MTU1MDQzNDg3NzB9.yyKKnOT4lupQ7RSl1tt1XExpPyOhE68Z06XDpPVUnP8=", "secret",{ algorithms: ['HS256'] })
        // console.log({decoded})
        // if (!decoded) {
        //     return res.json({ message: "In-valid token payload" })
        // }
        // if(token == "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJleHAiOjE3MTU1MTI1Mzc5MTd9.vXUVMweWLHAs22dQSNypaANsgQTos4DcpI3S7PzLkLI=")
        //     {
        //         return res.json("a7a")
        //     }
        //     else{
        //         return res.json("a7a bardo")
        //     }

     const decoded = await verifyToken(token, 'secret', (err, decoded) => {
            if (err) {
                // Token verification failed
                console.error('Invalid token:', err);
            } else {
                // Token verification succeeded
                console.log('Decoded token:', decoded);
            }
        });
        console.log({decoded:decoded.id});

        const userResponse = await axios.get(`http://127.0.0.1:8081/ejb8-1.0-SNAPSHOT/api/auth/Accounts`)
        const data = userResponse.data

        let flag = false
        let user = {}
        for (const obj of data) {
            console.log({obj});
            // if(decoded._id == obj.id)
            //     {
            //         user = obj
            //         console.log({user});
            //         flag = true
            //         break
            //     }
            if(decoded.id == obj.id)
                {
                    user = obj
                    console.log({user});
                    flag = true
                    break
                }
        } 
        if(!flag)
            {
                return res.json("id not found")
            }

        if(!roles.includes(user.role))
        {
            return res.json({ message: "u are not authorized" })
        }
        req.user = user;
        return next()
    } 
    // catch (error) {
    //     return res.json({ message: "Catch error" , err:error?.message })
    // }
}
//}
export default auth