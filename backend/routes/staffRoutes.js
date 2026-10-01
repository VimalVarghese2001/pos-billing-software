const express = require("express");

const {
    createStaff,
    getStaff,
    getStaffMember,
    updateStaff,
    deleteStaff
} = require("../controllers/staffController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


// CREATE STAFF
// Admin only
router.post(
    "/",
    protect,
    authorize("admin"),
    createStaff
);


// GET ALL STAFF
// Admin only
router.get(
    "/",
    protect,
    authorize("admin"),
    getStaff
);


// GET SINGLE STAFF
// Admin only
router.get(
    "/:id",
    protect,
    authorize("admin"),
    getStaffMember
);


// UPDATE STAFF
// Admin only
router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateStaff
);


// DELETE STAFF
// Admin only
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteStaff
);


module.exports = router;