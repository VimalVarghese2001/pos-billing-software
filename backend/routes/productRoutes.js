const express = require("express");

const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


// GET ALL PRODUCTS
// Admin + Staff
router.get("/", protect, getProducts);


// GET SINGLE PRODUCT
// Admin + Staff
router.get("/:id", protect, getProduct);


// CREATE PRODUCT
// Admin only
router.post("/", protect, authorize("admin"), createProduct);


// UPDATE PRODUCT
// Admin only
router.put("/:id", protect, authorize("admin"), updateProduct);


// DELETE PRODUCT
// Admin only
router.delete("/:id", protect, authorize("admin"), deleteProduct);


module.exports = router;