const express = require("express");

const {
    createSupplier,
    getSuppliers,
    getSupplier,
    updateSupplier,
    deleteSupplier
} = require("../controllers/supplierController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


// GET ALL SUPPLIERS
// Admin + Staff
router.get("/", protect, getSuppliers);


// GET SINGLE SUPPLIER
// Admin + Staff
router.get("/:id", protect, getSupplier);


// CREATE SUPPLIER
// Admin only
router.post("/", protect, authorize("admin"), createSupplier);


// UPDATE SUPPLIER
// Admin only
router.put("/:id", protect, authorize("admin"), updateSupplier);


// DELETE SUPPLIER
// Admin only
router.delete("/:id", protect, authorize("admin"), deleteSupplier);


module.exports = router;