//fetch the data from jwt token

import jwt from "jsonwebtoken";

const ensureAuthenticated = (req,res,next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } 
    catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

export default ensureAuthenticated;