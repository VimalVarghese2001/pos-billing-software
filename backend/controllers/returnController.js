const Return = require("../models/Return");
const Transaction = require("../models/Transaction");
const Product = require("../models/Product");


// ROUND MONEY TO 2 DECIMAL PLACES
const roundMoney = (value) => {
    return Math.round((value + Number.EPSILON) * 100) / 100;
};


// CREATE RETURN
const createReturn = async (req, res) => {
    try {
        const {
            transactionId,
            productId,
            quantity,
            reason
        } = req.body;


        // Check required fields
        if (!transactionId || !productId || !quantity || !reason) {
            return res.status(400).json({
                message: "Transaction, product, quantity and reason are required"
            });
        }


        // Validate quantity
        if (quantity < 1) {
            return res.status(400).json({
                message: "Return quantity must be at least 1"
            });
        }


        // Find original transaction
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }


        // Only completed transactions can be returned
        if (transaction.status !== "completed") {
            return res.status(400).json({
                message: "Only completed transactions can be returned"
            });
        }


        // Find product inside transaction
        const transactionItem = transaction.items.find(
            item => item.product.toString() === productId
        );

        if (!transactionItem) {
            return res.status(400).json({
                message: "Product was not part of this transaction"
            });
        }


        // Find previous returns for this transaction and product
        const previousReturns = await Return.find({
            transaction: transactionId,
            product: productId,
            status: "completed"
        });


        // Calculate already returned quantity
        const alreadyReturnedQuantity = previousReturns.reduce(
            (total, returnItem) => total + returnItem.quantity,
            0
        );


        // Calculate remaining returnable quantity
        const remainingQuantity =
            transactionItem.quantity - alreadyReturnedQuantity;


        // Check requested quantity
        if (quantity > remainingQuantity) {
            return res.status(400).json({
                message: `Only ${remainingQuantity} item(s) can be returned`
            });
        }


        // Calculate refund
        const refundAmount = roundMoney(
            transactionItem.price * quantity
        );


        // Find current product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }


        // Create return record
        const returnRecord = await Return.create({
            transaction: transactionId,
            product: productId,
            productName: transactionItem.productName,
            sku: transactionItem.sku,
            quantity,
            refundAmount,
            reason,
            processedBy: req.user.userId,
            status: "completed"
        });


        // Increase stock
        await Product.findByIdAndUpdate(
            productId,
            {
                $inc: {
                    stock: quantity
                }
            }
        );


        res.status(201).json({
            message: "Product return processed successfully",
            return: returnRecord
        });


    } catch (error) {

        console.error(
            "Create return error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET ALL RETURNS
const getReturns = async (req, res) => {
    try {

        const returns = await Return.find()
            .populate("transaction", "invoiceNumber")
            .populate("product", "name sku")
            .populate("processedBy", "name email")
            .sort({ createdAt: -1 });


        res.json({
            count: returns.length,
            returns
        });


    } catch (error) {

        console.error(
            "Get returns error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET SINGLE RETURN
const getReturn = async (req, res) => {
    try {

        const returnRecord =
            await Return.findById(req.params.id)
                .populate("transaction", "invoiceNumber")
                .populate("product", "name sku")
                .populate("processedBy", "name email");


        if (!returnRecord) {
            return res.status(404).json({
                message: "Return not found"
            });
        }


        res.json({
            return: returnRecord
        });


    } catch (error) {

        console.error(
            "Get return error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createReturn,
    getReturns,
    getReturn
};