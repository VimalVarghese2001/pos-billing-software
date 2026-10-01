const Product = require("../models/Product");

// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {
        const {
            name,
            sku,
            category,
            price,
            costPrice,
            stock,
            tax,
            supplier,
            description
        } = req.body;

        // Check required fields
        if (!name || !sku || !category || price === undefined || costPrice === undefined) {
            return res.status(400).json({
                message: "Name, SKU, category, price and cost price are required"
            });
        }

        // Check if SKU already exists
        const existingProduct = await Product.findOne({ sku });

        if (existingProduct) {
            return res.status(400).json({
                message: "Product with this SKU already exists"
            });
        }

        // Create product
        const product = await Product.create({
            name,
            sku,
            category,
            price,
            costPrice,
            stock,
            tax,
            supplier: supplier || null,
            description
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.error("Create product error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET ALL PRODUCTS
const getProducts = async (req, res) => {
    try {
            const products = await Product.find()
     .populate("supplier", "name companyName");

        res.json({
            count: products.length,
            products
        });

    } catch (error) {
        console.error("Get products error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET SINGLE PRODUCT
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
             .populate("supplier", "name companyName");

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            product
        });

    } catch (error) {
        console.error("Get product error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.json({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        console.error("Update product error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error("Delete product error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
};