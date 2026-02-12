import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body;
         
        // Mock sync: No phoneNumber check
        if (!fullname || !email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'Email already registered', // Mock message sync
                success: false,
            })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            message: "Registration successful", // Mock message sync
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password", // Mock message sync
                success: false,
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
                success: false,
            })
        };

        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        // Password hide karke sirf safe data bhejna
        const safeUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role
        };

        return res.status(200).cookie("token", token, { 
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            sameSite: 'strict' 
        }).json({
            message: "Login successful",
            user: safeUser,
            token, // Token for frontend storage
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}


export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}