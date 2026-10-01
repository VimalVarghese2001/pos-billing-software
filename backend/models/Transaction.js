const mongoose = require("mongoose");


// TRANSACTION ITEM SCHEMA
const transactionItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        productName: {
            type: String,
            required: true
        },

        sku: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        tax: {
            type: Number,
            default: 0,
            min: 0
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        _id: false
    }
);


// TRANSACTION SCHEMA
const transactionSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: {
            type: [transactionItemSchema],
            required: true,
            validate: {
                validator: function (items) {
                    return items.length > 0;
                },
                message: "Transaction must contain at least one item"
            }
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        taxAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        discount: {
            type: Number,
            default: 0,
            min: 0
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentMethod: {
            type: String,
            enum: ["cash", "card", "upi"],
            required: true
        },

        amountPaid: {
            type: Number,
            required: true,
            min: 0
        },

        changeAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        status: {
            type: String,
            enum: ["completed", "cancelled", "refunded"],
            default: "completed"
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model("Transaction", transactionSchema);