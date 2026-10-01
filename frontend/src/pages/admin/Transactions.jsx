import { useEffect, useState } from "react";
import {
    ReceiptText,
    Search,
    Eye,
    X,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import api from "../../services/api";

function Transactions() {

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [status, setStatus] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalTransactions: 0,
        totalPages: 1
    });

    const [selectedTransaction, setSelectedTransaction] =
        useState(null);

    const getTransactions = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const params = new URLSearchParams();

            params.append("page", page);
            params.append("limit", 10);

            if (search.trim()) {
                params.append("search", search.trim());
            }

            if (paymentMethod) {
                params.append(
                    "paymentMethod",
                    paymentMethod
                );
            }

            if (status) {
                params.append("status", status);
            }

            if (from) {
                params.append("from", from);
            }

            if (to) {
                params.append("to", to);
            }

            const response = await api.get(
                `/transactions?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTransactions(
                response.data.transactions
            );

            setPagination(
                response.data.pagination
            );

        } catch (error) {

            console.error(
                "Failed to load transactions:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        getTransactions();
    }, [
        page,
        search,
        paymentMethod,
        status,
        from,
        to
    ]);


    const clearFilters = () => {

        setSearch("");
        setPaymentMethod("");
        setStatus("");
        setFrom("");
        setTo("");
        setPage(1);

    };


    const formatCurrency = (amount) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2
            }
        ).format(amount || 0);

    };


    const formatDate = (date) => {

        return new Date(date).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    };


    return (
        <div className="page-container">

            {/* Page Header */}

            <div className="page-header">

                <div>

                    <div className="page-eyebrow">
                        SALES
                    </div>

                    <h1>Transactions</h1>

                    <p>
                        View and manage all billing transactions.
                    </p>

                </div>

            </div>


            {/* Filters */}

            <div className="transactions-card">

                <div className="transactions-filters">

                    <div className="transaction-search">

                        <Search size={19} />

                        <input
                            type="text"
                            placeholder="Search invoice..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />

                    </div>


                    <select
                        value={paymentMethod}
                        onChange={(e) => {
                            setPaymentMethod(e.target.value);
                            setPage(1);
                        }}
                    >

                        <option value="">
                            All Payments
                        </option>

                        <option value="cash">
                            Cash
                        </option>

                        <option value="card">
                            Card
                        </option>

                        <option value="upi">
                            UPI
                        </option>

                    </select>


                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="completed">
                            Completed
                        </option>

                        <option value="cancelled">
                            Cancelled
                        </option>

                    </select>


                    <input
                        type="date"
                        value={from}
                        onChange={(e) => {
                            setFrom(e.target.value);
                            setPage(1);
                        }}
                    />


                    <input
                        type="date"
                        value={to}
                        onChange={(e) => {
                            setTo(e.target.value);
                            setPage(1);
                        }}
                    />


                    <button
                        className="clear-filter-btn"
                        onClick={clearFilters}
                    >
                        Clear
                    </button>

                </div>


                {/* Table Header */}

                <div className="transactions-top">

                    <span>
                        {pagination.totalTransactions} transactions
                    </span>

                </div>


                {/* Table */}

                <div className="table-wrapper">

                    <table className="data-table">

                        <thead>

                            <tr>

                                <th>INVOICE</th>

                                <th>STAFF</th>

                                <th>ITEMS</th>

                                <th>TOTAL</th>

                                <th>PAYMENT</th>

                                <th>STATUS</th>

                                <th>DATE</th>

                                <th>ACTION</th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="empty-table"
                                    >
                                        Loading transactions...
                                    </td>

                                </tr>

                            ) : transactions.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="empty-table"
                                    >
                                        No transactions found.
                                    </td>

                                </tr>

                            ) : (

                                transactions.map(
                                    (transaction) => (

                                        <tr
                                            key={
                                                transaction._id
                                            }
                                        >

                                            <td>

                                                <div className="invoice-cell">

                                                    <div className="transaction-icon">
                                                        <ReceiptText
                                                            size={18}
                                                        />
                                                    </div>

                                                    <strong>
                                                        {
                                                            transaction.invoiceNumber
                                                        }
                                                    </strong>

                                                </div>

                                            </td>


                                            <td>
                                                {
                                                    transaction.staff?.name ||
                                                    "Unknown"
                                                }
                                            </td>


                                            <td>

                                                {transaction.items.reduce(
                                                    (
                                                        total,
                                                        item
                                                    ) =>
                                                        total +
                                                        item.quantity,
                                                    0
                                                )}

                                            </td>


                                            <td>

                                                <strong>
                                                    {formatCurrency(
                                                        transaction.totalAmount
                                                    )}
                                                </strong>

                                            </td>


                                            <td>

                                                <span className="payment-badge">

                                                    {
                                                        transaction.paymentMethod
                                                    }

                                                </span>

                                            </td>


                                            <td>

                                                <span
                                                    className={`status-badge ${
                                                        transaction.status ===
                                                        "completed"
                                                            ? "status-active"
                                                            : "status-cancelled"
                                                    }`}
                                                >
                                                    {
                                                        transaction.status
                                                    }
                                                </span>

                                            </td>


                                            <td>

                                                <span className="date-text">

                                                    {formatDate(
                                                        transaction.createdAt
                                                    )}

                                                </span>

                                            </td>


                                            <td>

                                                <button
                                                    className="icon-action view-action"
                                                    title="View transaction"
                                                    onClick={() =>
                                                        setSelectedTransaction(
                                                            transaction
                                                        )
                                                    }
                                                >
                                                    <Eye
                                                        size={18}
                                                    />
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {/* Pagination */}

                {!loading &&
                    pagination.totalTransactions > 0 && (

                        <div className="pagination">

                            <span>

                                Page{" "}
                                {pagination.currentPage}{" "}
                                of{" "}
                                {pagination.totalPages}

                            </span>


                            <div className="pagination-buttons">

                                <button
                                    disabled={
                                        page <= 1
                                    }
                                    onClick={() =>
                                        setPage(
                                            page - 1
                                        )
                                    }
                                >
                                    <ChevronLeft
                                        size={18}
                                    />
                                </button>


                                <button
                                    disabled={
                                        page >=
                                        pagination.totalPages
                                    }
                                    onClick={() =>
                                        setPage(
                                            page + 1
                                        )
                                    }
                                >
                                    <ChevronRight
                                        size={18}
                                    />
                                </button>

                            </div>

                        </div>

                    )}

            </div>


            {/* Transaction Details Modal */}

            {selectedTransaction && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setSelectedTransaction(null)
                    }
                >

                    <div
                        className="transaction-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <span className="page-eyebrow">
                                    TRANSACTION
                                </span>

                                <h2>
                                    {
                                        selectedTransaction.invoiceNumber
                                    }
                                </h2>

                            </div>


                            <button
                                className="modal-close"
                                onClick={() =>
                                    setSelectedTransaction(
                                        null
                                    )
                                }
                            >
                                <X size={22} />
                            </button>

                        </div>


                        <div className="transaction-summary">

                            <div>
                                <span>Staff</span>
                                <strong>
                                    {
                                        selectedTransaction
                                            .staff?.name ||
                                        "Unknown"
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Payment</span>
                                <strong>
                                    {
                                        selectedTransaction.paymentMethod
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Date</span>
                                <strong>
                                    {formatDate(
                                        selectedTransaction.createdAt
                                    )}
                                </strong>
                            </div>

                        </div>


                        <h3>Items</h3>


                        <div className="transaction-items">

                            {selectedTransaction.items.map(
                                (item, index) => (

                                    <div
                                        className="transaction-item"
                                        key={index}
                                    >

                                        <div>

                                            <strong>
                                                {
                                                    item.productName
                                                }
                                            </strong>

                                            <small>
                                                {
                                                    item.sku
                                                }{" "}
                                                ×{" "}
                                                {
                                                    item.quantity
                                                }
                                            </small>

                                        </div>

                                        <strong>
                                            {formatCurrency(
                                                item.subtotal
                                            )}
                                        </strong>

                                    </div>

                                )
                            )}

                        </div>


                        <div className="transaction-total">

                            <div>
                                <span>Subtotal</span>
                                <strong>
                                    {formatCurrency(
                                        selectedTransaction.subtotal
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Tax</span>
                                <strong>
                                    {formatCurrency(
                                        selectedTransaction.taxAmount
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Discount</span>
                                <strong>
                                    {formatCurrency(
                                        selectedTransaction.discount
                                    )}
                                </strong>
                            </div>

                            <div className="grand-total">
                                <span>Total</span>
                                <strong>
                                    {formatCurrency(
                                        selectedTransaction.totalAmount
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Amount Paid</span>
                                <strong>
                                    {formatCurrency(
                                        selectedTransaction.amountPaid
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Change</span>
                                <strong>
                                    {formatCurrency(
                                        selectedTransaction.changeAmount
                                    )}
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Transactions;