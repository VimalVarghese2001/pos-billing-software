const Transaction = require("../models/Transaction");
const Product = require("../models/Product");

// Round money values to 2 decimal places
const roundMoney = (value) => {
    return Math.round((value + Number.EPSILON) * 100) / 100;
};


// GENERATE INVOICE NUMBER
const generateInvoiceNumber = async () => {
    const count = await Transaction.countDocuments();

    const nextNumber = count + 1;

    return `INV-${String(nextNumber).padStart(6, "0")}`;
};


// CREATE TRANSACTION
const createTransaction = async (req, res) => {
    try {
        const {
            items,
            discount = 0,
            paymentMethod,
            amountPaid
        } = req.body;

        // Check required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "At least one product is required"
            });
        }

        if (!paymentMethod) {
            return res.status(400).json({
                message: "Payment method is required"
            });
        }

        if (amountPaid === undefined) {
            return res.status(400).json({
                message: "Amount paid is required"
            });
        }

        // Prevent negative discount
        if (discount < 0) {
            return res.status(400).json({
                message: "Discount cannot be negative"
            });
        }


        // Prepare transaction items
        const transactionItems = [];

        let subtotal = 0;
        let taxAmount = 0;


        // Process each product
        for (const item of items) {

            if (!item.product || !item.quantity) {
                return res.status(400).json({
                    message: "Product and quantity are required"
                });
            }

            if (item.quantity < 1) {
                return res.status(400).json({
                    message: "Quantity must be at least 1"
                });
            }


            // Find product
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    message: `Product not found: ${item.product}`
                });
            }


            // Check stock
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}. Available stock: ${product.stock}`
                });
            }


            // Calculate item subtotal
            const itemSubtotal = roundMoney(
                product.price * item.quantity
            );


            // Calculate item tax
            const itemTax = roundMoney(
                 itemSubtotal * (product.tax / 100)
            );


            // Add to totals
            subtotal = roundMoney(
                subtotal + itemSubtotal
            );

            taxAmount = roundMoney(
                taxAmount + itemTax
            );


            // Save price snapshot
            transactionItems.push({
                product: product._id,
                productName: product.name,
                sku: product.sku,
                quantity: item.quantity,
                price: product.price,
                tax: product.tax,
                subtotal: itemSubtotal
            });
        }


        // Calculate final total
         const totalAmount = roundMoney(
            subtotal + taxAmount - discount
        );


        // Prevent negative total
        if (totalAmount < 0) {
            return res.status(400).json({
                message: "Discount cannot be greater than the bill amount"
            });
        }


        // Check payment
        if (amountPaid < totalAmount) {
            return res.status(400).json({
                message: `Insufficient payment. Total amount is ${totalAmount}`
            });
        }


        // Calculate change
        const changeAmount = roundMoney(
            amountPaid - totalAmount
        );


        // Generate invoice number
        const invoiceNumber =
            await generateInvoiceNumber();


        // Create transaction
        const transaction = await Transaction.create({
            invoiceNumber,
            staff: req.user.userId,
            items: transactionItems,
            subtotal,
            taxAmount,
            discount,
            totalAmount,
            paymentMethod,
            amountPaid,
            changeAmount,
            status: "completed"
        });


        // Reduce product stock
        for (const item of items) {

            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }


        res.status(201).json({
            message: "Transaction created successfully",
            transaction
        });

    } catch (error) {

        console.error(
            "Create transaction error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET ALL TRANSACTIONS
const getTransactions = async (req, res) => {
    try {

        const {
            search,
            paymentMethod,
            status,
            staff,
            from,
            to,
            page = 1,
            limit = 10
        } = req.query;


        // Build query
        const query = {};


        // Search by invoice number
        if (search) {
            query.invoiceNumber = {
                $regex: search,
                $options: "i"
            };
        }


        // Filter by payment method
        if (paymentMethod) {
            query.paymentMethod = paymentMethod;
        }


        // Filter by transaction status
        if (status) {
            query.status = status;
        }


        // Filter by staff
        if (staff) {
            query.staff = staff;
        }


        // Filter by date range
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


        // Convert pagination values to numbers
        const currentPage = Math.max(
            parseInt(page) || 1,
            1
        );

        const itemsPerPage = Math.min(
            Math.max(parseInt(limit) || 10, 1),
            100
        );


        // Calculate how many records to skip
        const skip = (
            currentPage - 1
        ) * itemsPerPage;


        // Get total matching transactions
        const totalTransactions =
            await Transaction.countDocuments(query);


        // Get transactions
        const transactions =
            await Transaction.find(query)
                .populate("staff", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(itemsPerPage);


        // Calculate total pages
        const totalPages = Math.ceil(
            totalTransactions / itemsPerPage
        );


        res.json({

            filters: {
                search: search || null,
                paymentMethod: paymentMethod || null,
                status: status || null,
                staff: staff || null,
                from: from || null,
                to: to || null
            },

            pagination: {
                currentPage,
                itemsPerPage,
                totalTransactions,
                totalPages
            },

            transactions
        });


    } catch (error) {

        console.error(
            "Get transactions error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET SINGLE TRANSACTION
const getTransaction = async (req, res) => {
    try {

        const transaction =
            await Transaction.findById(req.params.id)
                .populate("staff", "name email");

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.json({
            transaction
        });

    } catch (error) {

        console.error(
            "Get transaction error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createTransaction,
    getTransactions,
    getTransaction
};