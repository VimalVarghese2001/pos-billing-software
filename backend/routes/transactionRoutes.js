const express = require("express");

const {
    createTransaction,
    getTransactions,
    getTransaction
} = require("../controllers/transactionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE TRANSACTION
// Admin + Staff
router.post(
    "/",
    protect,
    createTransaction
);


// GET ALL TRANSACTIONS
// Admin + Staff
router.get(
    "/",
    protect,
    getTransactions
);


// GET SINGLE TRANSACTION
// Admin + Staff
router.get(
    "/:id",
    protect,
    getTransaction
);


module.exports = router;