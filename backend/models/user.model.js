import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullname: { 
        type: String, 
        required: true,
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    password: { 
        type: String, 
        required: true,
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], // Mock API mein yahi do roles hain
        required: true 
    }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);