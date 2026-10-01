const express = require("express");

const {
    getSalesReport
} = require("../controllers/reportController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


// GET SALES REPORT
// Admin only
router.get(
    "/sales",
    protect,
    authorize("admin"),
    getSalesReport
);


module.exports = router;