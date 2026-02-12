import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import productRoute from './routes/product.route.js';
dotenv.config();

const app = express();

//middleware
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corOptions = {
  origin: 'http://localhost:8080', 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corOptions));

const PORT = process.env.PORT || 3000;

//routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/product', productRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})