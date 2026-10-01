const express = require("express");

const {
    createReturn,
    getReturns,
    getReturn
} = require("../controllers/returnController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


// CREATE RETURN
// Admin only
router.post(
    "/",
    protect,
    authorize("admin"),
    createReturn
);


// GET ALL RETURNS
// Admin only
router.get(
    "/",
    protect,
    authorize("admin"),
    getReturns
);


// GET SINGLE RETURN
// Admin only
router.get(
    "/:id",
    protect,
    authorize("admin"),
    getReturn
);


module.exports = router;