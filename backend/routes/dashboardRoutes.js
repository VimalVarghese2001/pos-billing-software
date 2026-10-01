const express = require("express");

const {
    getDashboardSummary
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


// GET DASHBOARD SUMMARY
// Admin only
router.get(
    "/",
    protect,
    authorize("admin"),
    getDashboardSummary
);


module.exports = router;