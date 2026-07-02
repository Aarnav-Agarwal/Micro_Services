import axios from "axios";
const authenticate = async (req,res,next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Token missing"
            });
        }
        const authBaseUrl = process.env.AUTH_SERVICE || "http://localhost:4001/auth";
        const authUrl = authBaseUrl.endsWith("/auth") ? `${authBaseUrl}/me` : `${authBaseUrl}/auth/me`;
        const response = await axios.get(authUrl,
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
