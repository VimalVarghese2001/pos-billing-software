import { useEffect, useState } from "react";
import {
    IndianRupee,
    ShoppingCart,
    Package,
    RotateCcw,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

import api from "../../services/api";

function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await api.get("/dashboard", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setData(response.data);

            } catch (err) {
                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load dashboard"
                );

            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner-border text-primary" />
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <AlertTriangle size={22} />
                <span>{error}</span>
            </div>
        );
    }

    const sales = data?.sales || {};
    const returns = data?.returns || {};
    const inventory = data?.inventory || {};

    return (
        <div className="dashboard-page">

            {/* PAGE HEADER */}

            <div className="page-header">

                <div>
                    <span className="page-eyebrow">
                        OVERVIEW
                    </span>

                    <h1>Dashboard</h1>

                    <p>
                        Here's what's happening with your store today.
                    </p>
                </div>

                <div className="today-badge">
                    {data?.date}
                </div>

            </div>


            {/* STAT CARDS */}

            <div className="row g-3 mb-4">

                {/* SALES */}

                <div className="col-12 col-sm-6 col-xl-3">

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <div className="stat-icon sales">
                                <IndianRupee size={20} />
                            </div>

                            <span className="stat-trend positive">
                                <ArrowUpRight size={15} />
                            </span>

                        </div>

                        <span className="stat-label">
                            Today's Sales
                        </span>

                        <h3>
                            ₹
                            {Number(sales.totalSales || 0).toLocaleString(
                                "en-IN",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            )}
                        </h3>

                        <small>
                            {sales.transactionCount || 0} transactions
                        </small>

                    </div>

                </div>


                {/* ITEMS SOLD */}

                <div className="col-12 col-sm-6 col-xl-3">

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <div className="stat-icon orders">
                                <ShoppingCart size={20} />
                            </div>

                            <span className="stat-trend positive">
                                <ArrowUpRight size={15} />
                            </span>

                        </div>

                        <span className="stat-label">
                            Items Sold
                        </span>

                        <h3>
                            {sales.itemsSold || 0}
                        </h3>

                        <small>
                            Items sold today
                        </small>

                    </div>

                </div>


                {/* PRODUCTS */}

                <div className="col-12 col-sm-6 col-xl-3">

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <div className="stat-icon products">
                                <Package size={20} />
                            </div>

                        </div>

                        <span className="stat-label">
                            Total Products
                        </span>

                        <h3>
                            {inventory.totalProducts || 0}
                        </h3>

                        <small>
                            Active products
                        </small>

                    </div>

                </div>


                {/* RETURNS */}

                <div className="col-12 col-sm-6 col-xl-3">

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <div className="stat-icon returns">
                                <RotateCcw size={20} />
                            </div>

                            <span className="stat-trend negative">
                                <ArrowDownRight size={15} />
                            </span>

                        </div>

                        <span className="stat-label">
                            Today's Returns
                        </span>

                        <h3>
                            ₹
                            {Number(returns.totalRefunds || 0).toLocaleString(
                                "en-IN",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            )}
                        </h3>

                        <small>
                            {returns.returnCount || 0} returns
                        </small>

                    </div>

                </div>

            </div>


            {/* LOWER SECTION */}

            <div className="row g-3">

                {/* SALES OVERVIEW */}

                <div className="col-12 col-lg-8">

                    <div className="dashboard-panel">

                        <div className="panel-header">

                            <div>
                                <h5>Sales Overview</h5>

                                <p>
                                    Today's performance
                                </p>
                            </div>

                            <div className="panel-icon">
                                <IndianRupee size={18} />
                            </div>

                        </div>


                        <div className="sales-summary">

                            <div>
                                <span>Total Sales</span>

                                <strong>
                                    ₹
                                    {Number(
                                        sales.totalSales || 0
                                    ).toLocaleString(
                                        "en-IN",
                                        {
                                            minimumFractionDigits: 2
                                        }
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Items Sold</span>

                                <strong>
                                    {sales.itemsSold || 0}
                                </strong>
                            </div>

                            <div>
                                <span>Transactions</span>

                                <strong>
                                    {sales.transactionCount || 0}
                                </strong>
                            </div>

                        </div>


                        {/* SIMPLE VISUAL CHART */}

                        <div className="dashboard-placeholder-chart">

                            <div className="chart-bars">

                                {[35, 55, 42, 70, 50, 80, 65].map(
                                    (height, index) => (
                                        <div
                                            key={index}
                                            className="chart-bar"
                                            style={{
                                                height: `${height}%`
                                            }}
                                        />
                                    )
                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* LOW STOCK */}

                <div className="col-12 col-lg-4">

                    <div className="dashboard-panel">

                        <div className="panel-header">

                            <div>
                                <h5>Low Stock</h5>

                                <p>
                                    Products needing attention
                                </p>
                            </div>

                            <div className="panel-icon warning">
                                <AlertTriangle size={18} />
                            </div>

                        </div>


                        {inventory.lowStockProducts?.length > 0 ? (

                            <div className="low-stock-list">

                                {inventory.lowStockProducts
                                    .slice(0, 5)
                                    .map((product) => (

                                        <div
                                            className="low-stock-item"
                                            key={product._id}
                                        >

                                            <div>

                                                <strong>
                                                    {product.name}
                                                </strong>

                                                <small>
                                                    {product.sku}
                                                </small>

                                            </div>

                                            <span>
                                                {product.stock}
                                            </span>

                                        </div>

                                    ))}

                            </div>

                        ) : (

                            <div className="empty-state">

                                <Package size={30} />

                                <p>
                                    No low-stock products
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;