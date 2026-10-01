import { useEffect, useState } from "react";
import {
    BarChart3,
    IndianRupee,
    ReceiptText,
    Package,
    Percent,
    CalendarDays,
    Search,
    RefreshCw
} from "lucide-react";

import api from "../../services/api";

function Reports() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchReport = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (from) {
                params.from = from;
            }

            if (to) {
                params.to = to;
            }

            const response = await api.get("/reports/sales", {
                params
            });

            setReport(response.data);

        } catch (error) {
            console.error("Reports error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load sales report"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const handleApply = () => {
        fetchReport();
    };

    const handleClear = () => {
        setFrom("");
        setTo("");

        setTimeout(() => {
            fetchReport();
        }, 0);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2
        }).format(value || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
    };

    const summary = report?.summary;

    return (
        <div className="page-container">

            {/* Page Header */}
            <div className="page-header">

                <div>
                    <div className="page-eyebrow">
                        ANALYTICS
                    </div>

                    <h1>Sales Reports</h1>

                    <p>
                        Analyze your sales and transaction performance.
                    </p>
                </div>

                <button
                    className="secondary-btn"
                    onClick={fetchReport}
                    disabled={loading}
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>

            </div>


            {/* Filters */}
            <div className="report-filter-card">

                <div className="filter-group">

                    <label>
                        <CalendarDays size={15} />
                        From
                    </label>

                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                    />

                </div>


                <div className="filter-group">

                    <label>
                        <CalendarDays size={15} />
                        To
                    </label>

                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                    />

                </div>


                <button
                    className="primary-btn"
                    onClick={handleApply}
                >
                    <Search size={17} />
                    Apply
                </button>


                <button
                    className="clear-btn"
                    onClick={handleClear}
                >
                    Clear
                </button>

            </div>


            {/* Error */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {/* Loading */}
            {loading ? (
                <div className="loading-card">
                    Loading sales report...
                </div>
            ) : (
                <>

                    {/* Summary Cards */}
                    <div className="report-summary-grid">

                        <div className="report-stat-card">

                            <div className="report-icon blue">
                                <IndianRupee size={21} />
                            </div>

                            <div>
                                <span>Total Sales</span>
                                <strong>
                                    {formatCurrency(
                                        summary?.totalSales
                                    )}
                                </strong>
                            </div>

                        </div>


                        <div className="report-stat-card">

                            <div className="report-icon green">
                                <ReceiptText size={21} />
                            </div>

                            <div>
                                <span>Transactions</span>
                                <strong>
                                    {summary?.transactionCount || 0}
                                </strong>
                            </div>

                        </div>


                        <div className="report-stat-card">

                            <div className="report-icon purple">
                                <Package size={21} />
                            </div>

                            <div>
                                <span>Items Sold</span>
                                <strong>
                                    {summary?.totalItemsSold || 0}
                                </strong>
                            </div>

                        </div>


                        <div className="report-stat-card">

                            <div className="report-icon orange">
                                <Percent size={21} />
                            </div>

                            <div>
                                <span>Total Tax</span>
                                <strong>
                                    {formatCurrency(
                                        summary?.totalTax
                                    )}
                                </strong>
                            </div>

                        </div>

                    </div>


                    {/* Discount Card */}
                    <div className="discount-summary-card">

                        <div>
                            <span>Total Discount</span>

                            <strong>
                                {formatCurrency(
                                    summary?.totalDiscount
                                )}
                            </strong>
                        </div>

                        <BarChart3 size={30} />

                    </div>


                    {/* Transactions */}
                    <div className="report-table-card">

                        <div className="report-table-header">

                            <div>
                                <h2>Sales Transactions</h2>

                                <p>
                                    {summary?.transactionCount || 0}{" "}
                                    transactions found
                                </p>
                            </div>

                        </div>


                        {report?.transactions?.length === 0 ? (

                            <div className="empty-report">

                                <BarChart3 size={42} />

                                <h3>No transactions found</h3>

                                <p>
                                    Try changing the selected date range.
                                </p>

                            </div>

                        ) : (

                            <div className="report-table-wrapper">

                                <table className="report-table">

                                    <thead>
                                        <tr>
                                            <th>INVOICE</th>
                                            <th>STAFF</th>
                                            <th>ITEMS</th>
                                            <th>SUBTOTAL</th>
                                            <th>TAX</th>
                                            <th>DISCOUNT</th>
                                            <th>TOTAL</th>
                                            <th>PAYMENT</th>
                                            <th>DATE</th>
                                        </tr>
                                    </thead>


                                    <tbody>

                                        {report?.transactions?.map(
                                            (transaction) => {

                                                const itemCount =
                                                    transaction.items?.reduce(
                                                        (
                                                            total,
                                                            item
                                                        ) =>
                                                            total +
                                                            item.quantity,
                                                        0
                                                    ) || 0;

                                                return (
                                                    <tr
                                                        key={
                                                            transaction._id
                                                        }
                                                    >

                                                        <td>
                                                            <span className="invoice-badge">
                                                                {
                                                                    transaction.invoiceNumber
                                                                }
                                                            </span>
                                                        </td>


                                                        <td>
                                                            {
                                                                transaction
                                                                    .staff
                                                                    ?.name ||
                                                                "Unknown"
                                                            }
                                                        </td>


                                                        <td>
                                                            {itemCount}
                                                        </td>


                                                        <td>
                                                            {formatCurrency(
                                                                transaction.subtotal
                                                            )}
                                                        </td>


                                                        <td>
                                                            {formatCurrency(
                                                                transaction.taxAmount
                                                            )}
                                                        </td>


                                                        <td>
                                                            {formatCurrency(
                                                                transaction.discount
                                                            )}
                                                        </td>


                                                        <td className="total-cell">
                                                            {formatCurrency(
                                                                transaction.totalAmount
                                                            )}
                                                        </td>


                                                        <td>
                                                            <span className="payment-badge">
                                                                {
                                                                    transaction.paymentMethod
                                                                }
                                                            </span>
                                                        </td>


                                                        <td>
                                                            {formatDate(
                                                                transaction.createdAt
                                                            )}
                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </>
            )}

        </div>
    );
}

export default Reports;