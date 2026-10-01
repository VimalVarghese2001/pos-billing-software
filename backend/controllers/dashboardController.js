const Transaction = require("../models/Transaction");
const Product = require("../models/Product");
const Return = require("../models/Return");


// ROUND MONEY
const roundMoney = (value) => {
    return Math.round((value + Number.EPSILON) * 100) / 100;
};


// GET DASHBOARD SUMMARY
const getDashboardSummary = async (req, res) => {
    try {

// Get today's date in India (IST)
const now = new Date();

const indiaDate = new Intl.DateTimeFormat(
    "en-CA",
    {
        timeZone: "Asia/Kolkata"
    }
).format(now);


// Start of today in IST
const startOfDay = new Date(
    `${indiaDate}T00:00:00+05:30`
);


// Start of tomorrow in IST
const tomorrow = new Date(startOfDay);
tomorrow.setUTCDate(
    tomorrow.getUTCDate() + 1
);

const startOfTomorrow = tomorrow;


        // Get today's completed transactions
        const transactions = await Transaction.find({
            status: "completed",
            createdAt: {
                $gte: startOfDay,
                $lt: startOfTomorrow
            }
        });


        // Calculate today's sales
        let totalSales = 0;
        let totalItemsSold = 0;


        for (const transaction of transactions) {

            totalSales += transaction.totalAmount;

            for (const item of transaction.items) {
                totalItemsSold += item.quantity;
            }
        }


        // Get today's returns
        const returns = await Return.find({
            status: "completed",
            createdAt: {
                $gte: startOfDay,
                $lt: startOfTomorrow
            }
        });


        // Calculate refund amount
        let totalRefunds = 0;
        let totalItemsReturned = 0;


        for (const returnItem of returns) {

            totalRefunds += returnItem.refundAmount;

            totalItemsReturned += returnItem.quantity;
        }


        // Get total products
        const totalProducts = await Product.countDocuments({
            isActive: true
        });


        // Get low-stock products
        const lowStockProducts = await Product.find({
            isActive: true,
            stock: {
                $lte: 10
            }
        })
        .select("name sku stock")
        .sort({ stock: 1 });


        res.json({
            date: indiaDate,

            sales: {
                totalSales: roundMoney(totalSales),
                transactionCount: transactions.length,
                itemsSold: totalItemsSold
            },

            returns: {
                totalRefunds: roundMoney(totalRefunds),
                returnCount: returns.length,
                itemsReturned: totalItemsReturned
            },

            inventory: {
                totalProducts,
                lowStockCount: lowStockProducts.length,
                lowStockProducts
            }
        });


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getDashboardSummary
};