import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // 1. Cookies se token nikalna
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated", // Mock style message
                success: false
            });
        }

        // 2. Token ko verify karna
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        }

        // 3. decoded payload se userId nikal kar request object mein dalna
        // Ensure karein ki login controller mein aapne 'userId' hi pass kiya tha
        req.id = decode.userId; 
        
        next(); // Agle controller (e.g., createProduct) par bhejna
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export default isAuthenticated;