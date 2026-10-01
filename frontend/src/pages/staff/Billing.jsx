import { useEffect, useState } from "react";

import {
    Search,
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    CreditCard,
    Banknote,
    X
} from "lucide-react";

import api from "../../services/api";


function Billing() {

    const [search, setSearch] = useState("");

    const [cart, setCart] = useState([]);

    const [paymentMethod, setPaymentMethod] = useState("cash");

    const [amountPaid, setAmountPaid] = useState("");

    const [receipt, setReceipt] = useState(null);

    const [products, setProducts] = useState([]);

    const [loadingProducts, setLoadingProducts] = useState(true);

    const [error, setError] = useState("");

    // FETCH PRODUCTS
    useEffect(() => {

        const fetchProducts = async () => {

            try {

                setLoadingProducts(true);

                const response = await api.get("/products");

                setProducts(response.data.products || []);

                setError("");

            } catch (error) {

                console.error(
                    "Failed to load products:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load products"
                );

            } finally {

                setLoadingProducts(false);

            }

        };


        fetchProducts();

    }, []);



    // Search products
    const filteredProducts = products.filter((product) => {

        const text = search.toLowerCase();

        return (
            product.name.toLowerCase().includes(text) ||
            product.sku.toLowerCase().includes(text) ||
            product.category.toLowerCase().includes(text)
        );

    });


    // Add product to cart
    const addToCart = (product) => {

        setCart((previousCart) => {

            const existingProduct = previousCart.find(
                item => item._id === product._id
            );


            if (existingProduct) {

                return previousCart.map(item =>
                    item._id === product._id
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                );

            }


            return [
                ...previousCart,
                {
                    ...product,
                    quantity: 1
                }
            ];

        });

    };


    // Increase quantity
    const increaseQuantity = (id) => {

        setCart((previousCart) =>
            previousCart.map(item =>
                item._id === id
                    ? {
                        ...item,
                        quantity: item.quantity + 1
                    }
                    : item
            )
        );

    };


    // Decrease quantity
    const decreaseQuantity = (id) => {

        setCart((previousCart) =>
            previousCart
                .map(item =>
                    item._id === id
                        ? {
                            ...item,
                            quantity: item.quantity - 1
                        }
                        : item
                )
                .filter(item => item.quantity > 0)
        );

    };


    // Remove product
    const removeFromCart = (id) => {

        setCart((previousCart) =>
            previousCart.filter(
                item => item._id !== id
            )
        );

    };


    // Calculate subtotal
    const subtotal = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );


    // Calculate tax
    const taxAmount = cart.reduce(
        (total, item) =>
            total +
            (
                item.price *
                item.quantity *
                item.tax
            ) / 100,
        0
    );


  const totalAmount = subtotal + taxAmount;


    // PRINT RECEIPT
const printReceipt = () => {
    if (!receipt) return;

    const printWindow = window.open(
        "",
        "_blank",
        "width=400,height=700"
    );

    if (!printWindow) {
        alert("Please allow pop-ups to print the receipt.");
        return;
    }

    const itemsHTML = receipt.items
        .map(
            (item) => `
                <div class="item">
                    <div>
                        <strong>${item.productName}</strong>
                        <span>${item.sku} × ${item.quantity}</span>
                    </div>

                    <strong>
                        ₹${Number(item.subtotal).toLocaleString("en-IN", {
                            minimumFractionDigits: 2
                        })}
                    </strong>
                </div>
            `
        )
        .join("");

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>

            <title>${receipt.invoiceNumber}</title>

            <style>

                @page {
                    size: 80mm 200mm;
                    margin: 0;
                }

                * {
                    box-sizing: border-box;
                }

                html,
                body {
                    margin: 0;
                    padding: 0;
                    width: 80mm;
                    background: white;
                    font-family: Arial, sans-serif;
                    color: #111;
                }

                .receipt {
                    width: 80mm;
                    padding: 6mm;
                    background: white;
                }

                .center {
                    text-align: center;
                }

                .title {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 4px;
                }

                .subtitle {
                    font-size: 10px;
                    margin-bottom: 10px;
                    color: #555;
                }

                .invoice {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }

                .line {
                    border-top: 1px dashed #777;
                    margin: 10px 0;
                }

                .info {
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    margin-bottom: 5px;
                }

                .section-title {
                    font-size: 13px;
                    font-weight: bold;
                    margin: 12px 0 8px;
                }

                .item {
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                    font-size: 11px;
                    margin-bottom: 8px;
                }

                .item div {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .item span {
                    color: #666;
                    font-size: 10px;
                }

                .item > strong {
                    white-space: nowrap;
                }

                .total-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    margin: 6px 0;
                }

                .grand-total {
                    font-size: 15px;
                    font-weight: bold;
                    margin: 8px 0;
                }

                .footer {
                    text-align: center;
                    font-size: 10px;
                    color: #666;
                    margin-top: 15px;
                }

            </style>

        </head>

        <body>

            <div class="receipt">

                <div class="center">

                    <div class="title">
                        PAYMENT SUCCESSFUL
                    </div>

                    <div class="invoice">
                        ${receipt.invoiceNumber}
                    </div>

                </div>

                <div class="line"></div>

                <div class="info">
                    <span>Date</span>
                    <strong>
                        ${new Date(receipt.createdAt).toLocaleString("en-IN")}
                    </strong>
                </div>

                <div class="info">
                    <span>Payment</span>
                    <strong>
                        ${receipt.paymentMethod.toUpperCase()}
                    </strong>
                </div>

                <div class="line"></div>

                <div class="section-title">
                    ITEMS
                </div>

                ${itemsHTML}

                <div class="line"></div>

                <div class="total-row">
                    <span>Subtotal</span>
                    <strong>
                        ₹${Number(receipt.subtotal).toLocaleString("en-IN", {
                            minimumFractionDigits: 2
                        })}
                    </strong>
                </div>

                <div class="total-row">
                    <span>Tax</span>
                    <strong>
                        ₹${Number(receipt.taxAmount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2
                        })}
                    </strong>
                </div>

                <div class="line"></div>

                <div class="total-row grand-total">
                    <span>TOTAL</span>
                    <strong>
                        ₹${Number(receipt.totalAmount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2
                        })}
                    </strong>
                </div>

                <div class="total-row">
                    <span>Amount Paid</span>
                    <strong>
                        ₹${Number(receipt.amountPaid).toLocaleString("en-IN", {
                            minimumFractionDigits: 2
                        })}
                    </strong>
                </div>

                <div class="total-row">
                    <span>Change</span>
                    <strong>
                        ₹${Number(receipt.changeAmount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2
                        })}
                    </strong>
                </div>

                <div class="line"></div>

                <div class="footer">
                    Thank you for your purchase!
                </div>

            </div>

        </body>
        </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
};


// COMPLETE PAYMENT
const completePayment = async () => {
        try {

            if (cart.length === 0) {
                alert("Please add at least one product");
                return;
            }

            if (!amountPaid || Number(amountPaid) <= 0) {
                alert("Please enter the amount paid");
                return;
            }

            if (Number(amountPaid) < totalAmount) {
                alert(
                    `Amount paid must be at least ₹${totalAmount.toFixed(2)}`
                );
                return;
            }

            const response = await api.post("/transactions", {

                items: cart.map((item) => ({
                    product: item._id,
                    quantity: item.quantity
                })),

                discount: 0,

                paymentMethod,

                amountPaid: Number(amountPaid)

            });


            setReceipt(response.data.transaction);


            // Clear cart
            setCart([]);

            // Clear amount paid
            setAmountPaid("");


            // Refresh products
            const productsResponse =
                await api.get("/products");

            setProducts(
                productsResponse.data.products || []
            );


        } catch (error) {

            console.error(
                "Payment failed:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Payment failed"
            );

        }
    };


    return (

    <>
    
        <div className="billing-page">

            {/* HEADER */}

            <div className="billing-header">

                <div>

                    <span className="page-eyebrow">
                        POINT OF SALE
                    </span>

                    <h1>Billing</h1>

                    <p>
                        Create a new customer bill.
                    </p>

                </div>

            </div>


            {/* MAIN BILLING AREA */}

            <div className="billing-layout">


                {/* LEFT SIDE */}

                <div className="billing-products">


                    {/* SEARCH */}

                    <div className="billing-search">

                        <Search size={19} />

                        <input
                            type="text"
                            placeholder="Search products by name or SKU..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    {/* PRODUCTS */}

                    <div className="billing-product-grid">

                        {filteredProducts.map(product => (

                            <div
                                className="billing-product-card"
                                key={product._id}
                            >

                                <div className="billing-product-icon">
                                    <ShoppingCart size={22} />
                                </div>


                                <div className="billing-product-info">

                                    <h4>
                                        {product.name}
                                    </h4>

                                    <span>
                                        {product.sku}
                                    </span>

                                    <strong>
                                        ₹{product.price.toLocaleString("en-IN", {
                                            minimumFractionDigits: 2
                                        })}
                                    </strong>

                                    <small>
                                        Stock: {product.stock}
                                    </small>

                                </div>


                                <button
                                    className="billing-add-btn"
                                    onClick={() =>
                                        addToCart(product)
                                    }
                                >

                                    <Plus size={18} />

                                </button>

                            </div>

                        ))}


                        {filteredProducts.length === 0 && (

                            <div className="billing-empty">

                                <ShoppingCart size={40} />

                                <h4>
                                    No products found
                                </h4>

                                <p>
                                    Try another product name or SKU.
                                </p>

                            </div>

                        )}

                    </div>

                </div>


                {/* RIGHT SIDE - CART */}

                <div className="billing-cart">


                    {/* CART HEADER */}

                    <div className="billing-cart-header">

                        <div>

                            <h3>
                                Current Bill
                            </h3>

                            <span>
                                {cart.length} product(s)
                            </span>

                        </div>

                        <ShoppingCart size={22} />

                    </div>


                    {/* CART ITEMS */}

                    <div className="billing-cart-items">

                        {cart.length === 0 ? (

                            <div className="billing-cart-empty">

                                <ShoppingCart size={42} />

                                <h4>
                                    Cart is empty
                                </h4>

                                <p>
                                    Select products to start billing.
                                </p>

                            </div>

                        ) : (

                            cart.map(item => (

                                <div
                                    className="billing-cart-item"
                                    key={item._id}
                                >

                                    <div className="cart-item-info">

                                        <strong>
                                            {item.name}
                                        </strong>

                                        <span>
                                            {item.sku}
                                        </span>

                                        <small>
                                            ₹{item.price.toLocaleString("en-IN", {
                                                minimumFractionDigits: 2
                                            })}
                                        </small>

                                    </div>


                                    <div className="cart-item-controls">

                                        <button
                                            onClick={() =>
                                                decreaseQuantity(item._id)
                                            }
                                        >
                                            <Minus size={14} />
                                        </button>


                                        <span>
                                            {item.quantity}
                                        </span>


                                        <button
                                            onClick={() =>
                                                increaseQuantity(item._id)
                                            }
                                        >
                                            <Plus size={14} />
                                        </button>

                                    </div>


                                    <strong className="cart-item-total">

                                        ₹{(
                                            item.price *
                                            item.quantity
                                        ).toLocaleString("en-IN", {
                                            minimumFractionDigits: 2
                                        })}

                                    </strong>


                                    <button
                                        className="cart-remove-btn"
                                        onClick={() =>
                                            removeFromCart(item._id)
                                        }
                                    >

                                        <Trash2 size={16} />

                                    </button>

                                </div>

                            ))

                        )}

                    </div>


                    {/* SUMMARY */}

                    <div className="billing-summary">

                        <div>

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ₹{subtotal.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2
                                })}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Tax
                            </span>

                            <strong>
                                ₹{taxAmount.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2
                                })}
                            </strong>

                        </div>


                        <div className="billing-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                ₹{totalAmount.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2
                                })}
                            </strong>

                        </div>

                    </div>


                    {/* PAYMENT */}

                    <div className="billing-payment">

                        <h4>
                            Payment Method
                        </h4>

                        <div className="payment-amount">

                            <label>
                                Amount Paid
                            </label>

                            <input
                                type="number"
                                min="0"
                                placeholder="Enter amount paid"
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                            />

                        </div>


                        <div className="payment-options">

                            <button
                                className={`payment-option ${paymentMethod === "cash" ? "active" : ""
                                    }`}
                                onClick={() => setPaymentMethod("cash")}
                            >
                                <Banknote size={19} />
                                Cash
                            </button>


                            <button
                                className={`payment-option ${paymentMethod === "card" ? "active" : ""
                                    }`}
                                onClick={() => setPaymentMethod("card")}
                            >
                                <CreditCard size={19} />
                                Card
                            </button>

                        </div>


                        <button
                            className="checkout-btn"
                            disabled={cart.length === 0}
                            onClick={completePayment}
                        >
                            Complete Payment
                        </button>

                    </div>

                </div>

            </div>

        </div>


    {/* RECEIPT MODAL */ }

    {
        receipt && (

            <div className="receipt-overlay">

                <div className="receipt-modal">

                    {/* HEADER */}

                    <div className="receipt-header">

                        <div>
                            <span className="page-eyebrow">
                                PAYMENT SUCCESSFUL
                            </span>

                            <h2>
                                {receipt.invoiceNumber}
                            </h2>
                        </div>

                        <button
                            className="receipt-close-btn"
                            onClick={() => setReceipt(null)}
                        >
                            ×
                        </button>

                    </div>


                    {/* RECEIPT INFO */}

                    <div className="receipt-info">

                        <div>
                            <span>Date</span>

                            <strong>
                                {new Date(
                                    receipt.createdAt
                                ).toLocaleString("en-IN")}
                            </strong>
                        </div>


                        <div>
                            <span>Payment</span>

                            <strong>
                                {receipt.paymentMethod}
                            </strong>
                        </div>

                    </div>


                    {/* ITEMS */}

                    <div className="receipt-items">

                        <h3>Items</h3>

                        {receipt.items.map((item) => (

                            <div
                                className="receipt-item"
                                key={item.product}
                            >

                                <div>

                                    <strong>
                                        {item.productName}
                                    </strong>

                                    <span>
                                        {item.sku} × {item.quantity}
                                    </span>

                                </div>

                                <strong>
                                    ₹{item.subtotal.toLocaleString(
                                        "en-IN",
                                        {
                                            minimumFractionDigits: 2
                                        }
                                    )}
                                </strong>

                            </div>

                        ))}

                    </div>


                    {/* TOTALS */}

                    <div className="receipt-totals">

                        <div>
                            <span>Subtotal</span>

                            <strong>
                                ₹{receipt.subtotal.toLocaleString(
                                    "en-IN",
                                    {
                                        minimumFractionDigits: 2
                                    }
                                )}
                            </strong>
                        </div>


                        <div>
                            <span>Tax</span>

                            <strong>
                                ₹{receipt.taxAmount.toLocaleString(
                                    "en-IN",
                                    {
                                        minimumFractionDigits: 2
                                    }
                                )}
                            </strong>
                        </div>


                        <div className="receipt-total">

                            <span>Total</span>

                            <strong>
                                ₹{receipt.totalAmount.toLocaleString(
                                    "en-IN",
                                    {
                                        minimumFractionDigits: 2
                                    }
                                )}
                            </strong>

                        </div>


                        <div>
                            <span>Amount Paid</span>

                            <strong>
                                ₹{receipt.amountPaid.toLocaleString(
                                    "en-IN",
                                    {
                                        minimumFractionDigits: 2
                                    }
                                )}
                            </strong>
                        </div>


                        <div>
                            <span>Change</span>

                            <strong>
                                ₹{receipt.changeAmount.toLocaleString(
                                    "en-IN",
                                    {
                                        minimumFractionDigits: 2
                                    }
                                )}
                            </strong>
                        </div>

                    </div>


                    {/* RECEIPT ACTIONS */}

                    <div className="receipt-actions">

                        <button
                            className="receipt-print-btn"
                            onClick={printReceipt}
                        >
                            🖨 Print Receipt
                        </button>

                        <button
                            className="receipt-done-btn"
                            onClick={() => setReceipt(null)}
                        >
                            Done
                        </button>

                    </div>

                    

                </div>

            </div>

             )}

        <style>{`
    @page {
        size: 80mm auto;
        margin: 0;
    }

    @media print {

        html,
        body {
            margin: 0 !important;
            padding: 0 !important;
            width: 80mm !important;
            min-height: 0 !important;
            height: auto !important;
            overflow: visible !important;
        }

        body * {
            visibility: hidden !important;
        }

        .receipt-overlay,
        .receipt-overlay * {
            visibility: visible !important;
        }

        .receipt-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;

            width: 80mm !important;
            height: auto !important;
            min-height: 0 !important;

            margin: 0 !important;
            padding: 0 !important;

            background: white !important;
            overflow: visible !important;
        }

        .receipt-modal {
            width: 80mm !important;
            max-width: 80mm !important;

            height: auto !important;
            max-height: none !important;
            min-height: 0 !important;

            margin: 0 !important;
            padding: 8mm !important;

            box-sizing: border-box !important;

            background: white !important;

            box-shadow: none !important;
            border-radius: 0 !important;

            overflow: visible !important;
        }

        .receipt-close-btn,
        .receipt-actions {
            display: none !important;
        }

        .receipt-header {
            page-break-inside: avoid !important;
        }

        .receipt-info,
        .receipt-items,
        .receipt-totals {
            page-break-inside: avoid !important;
        }

        .receipt-item {
            page-break-inside: avoid !important;
        }
    }
`}</style>
    </>

);

}


export default Billing;