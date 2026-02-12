import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

import { 
    createProduct, 
    deleteProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct 
} from "../controllers/product.controller.js";

router.route("/all").get(getAllProducts); 
router.route("/get/:id").get(getProductById); 
router.route("/create").post(isAuthenticated, createProduct); 
router.route("/update/:id").put(isAuthenticated, updateProduct); 
router.route("/delete/:id").delete(isAuthenticated, deleteProduct); 

export default router;
