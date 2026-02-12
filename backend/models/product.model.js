import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Yeh field track karega ki kis user ne product banaya hai
      required: true,
    },
  },
  { 
    timestamps: true // Yeh automatically 'createdAt' aur 'updatedAt' handle karega
  }
);

export const Product = mongoose.model('Product', productSchema);