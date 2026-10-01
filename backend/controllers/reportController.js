const Transaction = require("../models/Transaction");


// ROUND MONEY
const roundMoney = (value) => {
    return Math.round((value + Number.EPSILON) * 100) / 100;
};


// GET SALES REPORT
const getSalesReport = async (req, res) => {
    try {

        const { from, to } = req.query;

        // Build query
        const query = {
            status: "completed"
        };


        // If date range is provided
       if (from || to) {

    query.createdAt = {};

    if (from) {
        const fromDate = new Date(
            `${from}T00:00:00+05:30`
        );

        query.createdAt.$gte = fromDate;
    }

    if (to) {
        const toDate = new Date(
            `${to}T23:59:59.999+05:30`
        );

        query.createdAt.$lte = toDate;
    }
}


        // Get transactions
        const transactions = await Transaction.find(query)
            .populate("staff", "name email")
            .sort({ createdAt: -1 });


        // Calculate report totals
        let totalSales = 0;
        let totalTax = 0;
        let totalDiscount = 0;
        let totalItemsSold = 0;


        for (const transaction of transactions) {

            totalSales += transaction.totalAmount;
            totalTax += transaction.taxAmount;
            totalDiscount += transaction.discount;

            for (const item of transaction.items) {
                totalItemsSold += item.quantity;
            }
        }


        res.json({
            filters: {
                from: from || null,
                to: to || null
            },

            summary: {
                transactionCount: transactions.length,
                totalItemsSold,
                totalSales: roundMoney(totalSales),
                totalTax: roundMoney(totalTax),
                totalDiscount: roundMoney(totalDiscount)
            },

            transactions
        });


    } catch (error) {

        console.error(
            "Sales report error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getSalesReport
};