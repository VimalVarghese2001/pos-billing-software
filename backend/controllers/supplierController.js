const Supplier = require("../models/Supplier");

// CREATE SUPPLIER
const createSupplier = async (req, res) => {
    try {
        const {
            name,
            companyName,
            email,
            phone,
            address
        } = req.body;

        // Check required fields
        if (!name || !phone) {
            return res.status(400).json({
                message: "Name and phone are required"
            });
        }

        // Create supplier
        const supplier = await Supplier.create({
            name,
            companyName,
            email,
            phone,
            address
        });

        res.status(201).json({
            message: "Supplier created successfully",
            supplier
        });

    } catch (error) {
        console.error("Create supplier error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET ALL SUPPLIERS
const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();

        res.json({
            count: suppliers.length,
            suppliers
        });

    } catch (error) {
        console.error("Get suppliers error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET SINGLE SUPPLIER
const getSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        res.json({
            supplier
        });

    } catch (error) {
        console.error("Get supplier error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// UPDATE SUPPLIER
const updateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        const updatedSupplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.json({
            message: "Supplier updated successfully",
            supplier: updatedSupplier
        });

    } catch (error) {
        console.error("Update supplier error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// DELETE SUPPLIER
const deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        await Supplier.findByIdAndDelete(req.params.id);

        res.json({
            message: "Supplier deleted successfully"
        });

    } catch (error) {
        console.error("Delete supplier error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createSupplier,
    getSuppliers,
    getSupplier,
    updateSupplier,
    deleteSupplier
};