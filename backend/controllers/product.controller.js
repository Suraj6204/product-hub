import { Product } from "../models/product.model.js";
import redisClient from "../config/redis.js"; // Ensure redis setup is imported

// Helper to clear cache (Cache Invalidation)
const clearProductCache = async () => {
    await redisClient.del("products:all");
};

// 1. GET ALL PRODUCTS (With Caching)
export const getAllProducts = async (req, res) => {
    try {
        // 1. Redis mein check karein
        const cachedProducts = await redisClient.get("products:all");
        
        if (cachedProducts) {
            return res.status(200).json({
                success: true,
                message: "Products fetched from cache",
                products: JSON.parse(cachedProducts),
                cached: true // Frontend logic sync
            });
        }

        // 2. Agar cache miss hai toh DB se laayein
        const products = await Product.find({}).sort({ createdAt: -1 });
        
        // 3. Redis mein save karein (3600 sec = 1 hour)
        await redisClient.setEx("products:all", 3600, JSON.stringify(products));

        return res.status(200).json({
            success: true,
            message: "Products fetched from DB",
            products,
            cached: false
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

// 2. GET PRODUCT BY ID (Specific Caching)
export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const cacheKey = `product:${productId}`;

        // Check specific product cache
        const cachedProduct = await redisClient.get(cacheKey);
        if (cachedProduct) {
            return res.status(200).json({
                success: true,
                message: "Product fetched from cache",
                product: JSON.parse(cachedProduct),
                cached: true
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Save individual product to cache
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(product));

        return res.status(200).json({
            success: true,
            message: "Product fetched from DB",
            product,
            cached: false
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Invalid ID format" });
    }
}

// 3. CREATE PRODUCT (Clear Cache)
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const userId = req.id; 

        if (!name || !description || !price || !category) {
            return res.status(400).json({ success: false, message: "Something is missing" });
        }

        const product = await Product.create({
            name,
            description,
            price: Number(price),
            category,
            createdBy: userId 
        });

        // Naya product aate hi purana cache delete karna zaroori hai
        await clearProductCache();

        return res.status(201).json({
            success: true,
            message: "Product created",
            product
        });
    } catch (error) {
        console.log(error);
    }
}

// 4. UPDATE PRODUCT (Clear Cache)
export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndUpdate(productId, req.body, { new: true });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Cache saaf karein taaki updated data dikhe
        await clearProductCache();
        await redisClient.del(`product:${productId}`);

        return res.status(200).json({
            success: true,
            message: "Product updated",
            product
        });
    } catch (error) {
        console.log(error);
    }
}

// 5. DELETE PRODUCT (Clear Cache)
export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Cache invalidation
        await clearProductCache();
        await redisClient.del(`product:${productId}`);

        return res.status(200).json({
            success: true,
            message: "Product deleted"
        });
    } catch (error) {
        console.log(error);
    }
}