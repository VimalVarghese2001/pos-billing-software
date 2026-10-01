import { useEffect, useState } from "react";
import {
    RotateCcw,
    Search,
    Eye,
    X,
    AlertTriangle
} from "lucide-react";

import api from "../../services/api";

function Returns() {

    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedReturn, setSelectedReturn] = useState(null);

    const loadReturns = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.get("/returns", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setReturns(response.data.returns || []);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load returns"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReturns();
    }, []);

    const filteredReturns = returns.filter((item) => {

        const text = search.toLowerCase();

        return (
            item.transaction?.invoiceNumber
                ?.toLowerCase()
                .includes(text) ||

            item.productName
                ?.toLowerCase()
                .includes(text) ||

            item.sku
                ?.toLowerCase()
                .includes(text) ||

            item.reason
                ?.toLowerCase()
                .includes(text)
        );
    });

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
    };

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner-border text-primary" />
                <p>Loading returns...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            {/* HEADER */}

            <div className="page-header">

                <div>
                    <span className="page-eyebrow">
                        RETURNS
                    </span>

                    <h1>Returns</h1>

                    <p>
                        View and manage returned products.
                    </p>
                </div>

            </div>


            {/* ERROR */}

            {error && (
                <div className="dashboard-error mb-3">
                    <AlertTriangle size={20} />
                    <span>{error}</span>
                </div>
            )}


            {/* MAIN PANEL */}

            <div className="dashboard-panel returns-panel">

                {/* TOOLBAR */}

                <div className="products-toolbar">

                    <div className="search-box">

                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search invoice, product or SKU..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                    <span className="products-count">
                        {filteredReturns.length} returns
                    </span>

                </div>


                {/* TABLE */}

                {filteredReturns.length === 0 ? (

                    <div className="products-empty">

                        <RotateCcw size={40} />

                        <h5>No returns found</h5>

                        <p>
                            There are no returned products matching your search.
                        </p>

                    </div>

                ) : (

                    <div className="products-table-wrapper">

                        <table className="products-table returns-table">

                            <thead>
                                <tr>
                                    <th>INVOICE</th>
                                    <th>PRODUCT</th>
                                    <th>SKU</th>
                                    <th>QTY</th>
                                    <th>REFUND</th>
                                    <th>REASON</th>
                                    <th>PROCESSED BY</th>
                                    <th>DATE</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredReturns.map((item) => (

                                    <tr key={item._id}>

                                        <td>
                                            <span className="invoice-badge">
                                                {item.transaction?.invoiceNumber || "-"}
                                            </span>
                                        </td>


                                        <td>

                                            <div className="return-product-cell">

                                                <div className="return-icon">
                                                    <RotateCcw size={17} />
                                                </div>

                                                <div>
                                                    <strong>
                                                        {item.productName}
                                                    </strong>

                                                    <small>
                                                        Returned product
                                                    </small>
                                                </div>

                                            </div>

                                        </td>


                                        <td>
                                            <span className="sku-badge">
                                                {item.sku}
                                            </span>
                                        </td>


                                        <td>
                                            <span className="quantity-badge">
                                                {item.quantity}
                                            </span>
                                        </td>


                                        <td>
                                            <strong className="refund-amount">
                                                ₹{Number(
                                                    item.refundAmount
                                                ).toLocaleString("en-IN", {
                                                    minimumFractionDigits: 2
                                                })}
                                            </strong>
                                        </td>


                                        <td>
                                            <span className="reason-text">
                                                {item.reason}
                                            </span>
                                        </td>


                                        <td>
                                            {item.processedBy?.name || "-"}
                                        </td>


                                        <td>
                                            {formatDate(item.createdAt)}
                                        </td>


                                        <td>

                                            <button
                                                className="icon-action view"
                                                onClick={() =>
                                                    setSelectedReturn(item)
                                                }
                                                title="View return"
                                            >
                                                <Eye size={16} />
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* RETURN DETAILS MODAL */}

            {selectedReturn && (

                <div
                    className="modal-overlay"
                    onClick={() => setSelectedReturn(null)}
                >

                    <div
                        className="return-details-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="modal-header">

                            <div>

                                <span className="page-eyebrow">
                                    RETURN
                                </span>

                                <h4>
                                    Return Details
                                </h4>

                                <p>
                                    {selectedReturn.transaction?.invoiceNumber}
                                </p>

                            </div>

                            <button
                                className="modal-close"
                                onClick={() =>
                                    setSelectedReturn(null)
                                }
                            >
                                <X size={20} />
                            </button>

                        </div>


                        <div className="return-detail-grid">

                            <div className="return-detail-card">
                                <span>Invoice</span>
                                <strong>
                                    {selectedReturn.transaction?.invoiceNumber || "-"}
                                </strong>
                            </div>

                            <div className="return-detail-card">
                                <span>Product</span>
                                <strong>
                                    {selectedReturn.productName}
                                </strong>
                            </div>

                            <div className="return-detail-card">
                                <span>SKU</span>
                                <strong>
                                    {selectedReturn.sku}
                                </strong>
                            </div>

                            <div className="return-detail-card">
                                <span>Quantity</span>
                                <strong>
                                    {selectedReturn.quantity}
                                </strong>
                            </div>

                            <div className="return-detail-card">
                                <span>Refund Amount</span>
                                <strong className="refund-amount">
                                    ₹{Number(
                                        selectedReturn.refundAmount
                                    ).toLocaleString("en-IN", {
                                        minimumFractionDigits: 2
                                    })}
                                </strong>
                            </div>

                            <div className="return-detail-card">
                                <span>Processed By</span>
                                <strong>
                                    {selectedReturn.processedBy?.name || "-"}
                                </strong>
                            </div>

                        </div>


                        <div className="return-reason-box">

                            <span>Return Reason</span>

                            <p>
                                {selectedReturn.reason}
                            </p>

                        </div>


                        <div className="return-date">

                            <span>
                                Processed on
                            </span>

                            <strong>
                                {formatDate(selectedReturn.createdAt)}
                            </strong>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Returns;