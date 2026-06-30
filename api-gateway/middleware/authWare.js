// import jwt from "jsonwebtoken";

// const verifyToken = (req, res, next) => {
//       try {
//         const token = req.cookies.token;
//         if (!token) {
//             return res.status(401).json({
//                 message: "Unauthorized"
//             });
//         }
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } 
//     catch (error) {
//         return res.status(401).json({
//             message: "Invalid token"
//         });
//     }
// };

// export default verifyToken;



import axios from "axios";
const authenticate = async (req,res,next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Token missing"
            });
        }
        const response = await axios.get("http://localhost:4001/auth/me",
                {
                    headers: {authorization: authHeader}
                }
            );
        req.user = response.data.user;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
};
export default authenticate;




