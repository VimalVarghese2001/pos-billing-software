import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    Package,
    Users,
    Truck,
    Receipt,
    RotateCcw,
    BarChart3,
    Bell,
    Plus,
    Menu,
    X,
    ShoppingCart,
    IndianRupee,
    Boxes,
    TrendingUp
} from "lucide-react";

import api from "../services/api";

function MobileAdmin() {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);

                const dashboardResponse =
                    await api.get("/dashboard");

                setDashboard(
                    dashboardResponse.data
                );

                const transactionResponse =
                    await api.get(
                        "/transactions?limit=5&page=1"
                    );

                setTransactions(
                    transactionResponse.data.transactions || []
                );

            } catch (error) {

                console.error(
                    "Failed to load mobile admin dashboard:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        loadDashboard();

    }, []);


    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );


    const formatMoney = (value) => {

        return Number(value || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2
            }
        );

    };


    const formatDate = (date) => {

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    if (loading) {

        return (
            <div style={styles.loadingScreen}>
                <div style={styles.loadingCircle}></div>
                <p>Loading Admin Portal...</p>
            </div>
        );

    }


    return (

        <div style={styles.app}>

            {/* TOP HEADER */}

            <header style={styles.header}>

                <div style={styles.headerLeft}>

                    <button
                        style={styles.iconButton}
                        onClick={() =>
                            setMenuOpen(true)
                        }
                    >
                        <Menu size={22} />
                    </button>

                    <div>

                        <span style={styles.smallLabel}>
                            POS ADMIN
                        </span>

                        <h2 style={styles.headerTitle}>
                            Dashboard
                        </h2>

                    </div>

                </div>


                <button style={styles.notificationButton}>

                    <Bell size={20} />

                    <span style={styles.notificationDot}></span>

                </button>

            </header>


            {/* SIDE MENU */}

            {menuOpen && (

                <>

                    <div
                        style={styles.menuOverlay}
                        onClick={() =>
                            setMenuOpen(false)
                        }
                    ></div>


                    <aside style={styles.sideMenu}>

                        <div style={styles.menuHeader}>

                            <div>

                                <span style={styles.smallLabel}>
                                    POS SYSTEM
                                </span>

                                <h2 style={styles.menuTitle}>
                                    Admin
                                </h2>

                            </div>


                            <button
                                style={styles.iconButton}
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                            >
                                <X size={22} />
                            </button>

                        </div>


                        <div style={styles.menuUser}>

                            <div style={styles.avatar}>
                                {(user?.name || "A")
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div>

                                <strong>
                                    {user?.name || "Admin"}
                                </strong>

                                <span style={styles.menuUserRole}>
                                    Administrator
                                </span>

                            </div>

                        </div>


                        <nav style={styles.menuNavigation}>

                            <MenuItem
                                icon={<LayoutDashboard size={19} />}
                                label="Dashboard"
                                active
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                            />

                            <MenuItem
                                icon={<Package size={19} />}
                                label="Products"
                                onClick={() =>
                                    window.location.href =
                                    "/admin/products"
                                }
                            />

                            <MenuItem
                                icon={<Users size={19} />}
                                label="Staff"
                                onClick={() =>
                                    window.location.href =
                                    "/admin/staff"
                                }
                            />

                            <MenuItem
                                icon={<Truck size={19} />}
                                label="Suppliers"
                                onClick={() =>
                                    window.location.href =
                                    "/admin/suppliers"
                                }
                            />

                            <MenuItem
                                icon={<Receipt size={19} />}
                                label="Transactions"
                                onClick={() =>
                                    window.location.href =
                                    "/admin/transactions"
                                }
                            />

                            <MenuItem
                                icon={<RotateCcw size={19} />}
                                label="Returns"
                                onClick={() =>
                                    window.location.href =
                                    "/admin/returns"
                                }
                            />

                            <MenuItem
                                icon={<BarChart3 size={19} />}
                                label="Reports"
                                onClick={() =>
                                    window.location.href =
                                    "/admin/reports"
                                }
                            />

                        </nav>


                        <button
                            style={styles.logoutButton}
                            onClick={() => {

                                localStorage.removeItem("token");
                                localStorage.removeItem("user");

                                window.location.href =
                                    "/login";

                            }}
                        >
                            Logout
                        </button>

                    </aside>

                </>

            )}


            {/* MAIN CONTENT */}

            <main style={styles.content}>


                {/* WELCOME */}

                <section style={styles.welcomeCard}>

                    <div>

                        <span style={styles.welcomeSmall}>
                            GOOD DAY 👋
                        </span>

                        <h1 style={styles.welcomeTitle}>
                            Hello, {user?.name || "Admin"}
                        </h1>

                        <p style={styles.welcomeText}>
                            Here's what's happening with your store today.
                        </p>

                    </div>

                    <div style={styles.welcomeIcon}>
                        <TrendingUp size={28} />
                    </div>

                </section>


                {/* SALES CARDS */}

                <section style={styles.statsGrid}>

                    <StatCard
                        icon={<IndianRupee size={20} />}
                        label="Today's Sales"
                        value={
                            `₹${formatMoney(
                                dashboard?.sales?.totalSales
                            )}`
                        }
                    />

                    <StatCard
                        icon={<Receipt size={20} />}
                        label="Transactions"
                        value={
                            dashboard?.sales?.transactionCount || 0
                        }
                    />

                    <StatCard
                        icon={<ShoppingCart size={20} />}
                        label="Items Sold"
                        value={
                            dashboard?.sales?.itemsSold || 0
                        }
                    />

                    <StatCard
                        icon={<Boxes size={20} />}
                        label="Products"
                        value={
                            dashboard?.inventory?.totalProducts || 0
                        }
                    />

                </section>


                {/* QUICK ACTIONS */}

                <section>

                    <div style={styles.sectionHeader}>

                        <div>

                            <span style={styles.sectionLabel}>
                                QUICK ACTIONS
                            </span>

                            <h2 style={styles.sectionTitle}>
                                Manage Store
                            </h2>

                        </div>

                    </div>


                    <div style={styles.quickGrid}>

                        <QuickAction
                            icon={<Plus size={22} />}
                            title="Add Product"
                            subtitle="New inventory"
                            onClick={() =>
                                navigate("/admin/products")
                            }
                        />

                        <QuickAction
                            icon={<Users size={22} />}
                            title="Staff"
                            subtitle="Manage staff"
                            onClick={() =>
                                navigate("/admin/staff")
                            }
                        />

                        <QuickAction
                            icon={<Truck size={22} />}
                            title="Supplier"
                            subtitle="Manage suppliers"
                            onClick={() =>
                                navigate("/admin/suppliers")
                            }
                        />

                        <QuickAction
                            icon={<BarChart3 size={22} />}
                            title="Reports"
                            subtitle="View sales"
                            onClick={() =>
                                navigate("/admin/reports")
                            }
                        />

                    </div>

                </section>


                {/* RECENT TRANSACTIONS */}

                <section style={styles.transactionSection}>

                    <div style={styles.sectionHeader}>

                        <div>

                            <span style={styles.sectionLabel}>
                                RECENT ACTIVITY
                            </span>

                            <h2 style={styles.sectionTitle}>
                                Recent Transactions
                            </h2>

                        </div>


                        <button
                            style={styles.viewButton}
                            onClick={() =>
                                window.location.href =
                                "/admin/transactions"
                            }
                        >
                            View All
                        </button>

                    </div>


                    <div style={styles.transactionCard}>

                        {transactions.length === 0 ? (

                            <div style={styles.emptyState}>

                                <Receipt size={35} />

                                <p>
                                    No transactions found.
                                </p>

                            </div>

                        ) : (

                            transactions.map(
                                (transaction) => (

                                    <div
                                        key={transaction._id}
                                        style={styles.transactionRow}
                                    >

                                        <div
                                            style={
                                                styles.transactionIcon
                                            }
                                        >
                                            <Receipt size={18} />
                                        </div>


                                        <div
                                            style={
                                                styles.transactionInfo
                                            }
                                        >

                                            <strong>
                                                {
                                                    transaction.invoiceNumber
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    transaction.paymentMethod
                                                }{" "}
                                                •{" "}
                                                {
                                                    formatDate(
                                                        transaction.createdAt
                                                    )
                                                }
                                            </span>

                                        </div>


                                        <strong
                                            style={
                                                styles.transactionAmount
                                            }
                                        >
                                            ₹
                                            {formatMoney(
                                                transaction.totalAmount
                                            )}
                                        </strong>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </section>


                {/* INVENTORY SUMMARY */}

                <section style={styles.inventoryCard}>

                    <div style={styles.inventoryIcon}>
                        <Boxes size={24} />
                    </div>

                    <div style={styles.inventoryInfo}>

                        <span style={styles.sectionLabel}>
                            INVENTORY
                        </span>

                        <h3>
                            {dashboard?.inventory?.totalProducts || 0}
                            {" "}Products
                        </h3>

                        <p>
                            {dashboard?.inventory?.lowStock || 0}
                            {" "}products currently have low stock.
                        </p>

                    </div>

                </section>


            </main>


            {/* BOTTOM NAVIGATION */}

            <nav style={styles.bottomNav}>

                <BottomItem
                    icon={<LayoutDashboard size={21} />}
                    label="Home"
                    active
                    onClick={() =>
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        })
                    }
                />

                <BottomItem
                    icon={<Package size={21} />}
                    label="Products"
                    onClick={() =>
                        window.location.href =
                        "/admin/products"
                    }
                />

                <BottomItem
                    icon={<Receipt size={21} />}
                    label="Bills"
                    onClick={() =>
                        window.location.href =
                        "/admin/transactions"
                    }
                />

                <BottomItem
                    icon={<Users size={21} />}
                    label="Staff"
                    onClick={() =>
                        window.location.href =
                        "/admin/staff"
                    }
                />

                <BottomItem
                    icon={<BarChart3 size={21} />}
                    label="Reports"
                    onClick={() =>
                        window.location.href =
                        "/admin/reports"
                    }
                />

            </nav>

        </div>

    );

}


/* STAT CARD */

function StatCard({
    icon,
    label,
    value
}) {

    return (

        <div style={styles.statCard}>

            <div style={styles.statIcon}>
                {icon}
            </div>

            <span style={styles.statLabel}>
                {label}
            </span>

            <strong style={styles.statValue}>
                {value}
            </strong>

        </div>

    );

}


/* QUICK ACTION */

function QuickAction({
    icon,
    title,
    subtitle,
    onClick
}) {

    return (

        <button
            style={styles.quickAction}
            onClick={onClick}
        >

            <div style={styles.quickIcon}>
                {icon}
            </div>

            <div style={styles.quickText}>

                <strong>
                    {title}
                </strong>

                <span>
                    {subtitle}
                </span>

            </div>

        </button>

    );

}


/* MENU ITEM */

function MenuItem({
    icon,
    label,
    active,
    onClick
}) {

    return (

        <button
            onClick={onClick}
            style={{
                ...styles.menuItem,
                ...(active
                    ? styles.menuItemActive
                    : {})
            }}
        >

            {icon}

            <span>
                {label}
            </span>

        </button>

    );

}


/* BOTTOM NAV ITEM */

function BottomItem({
    icon,
    label,
    active,
    onClick
}) {

    return (

        <button
            onClick={onClick}
            style={{
                ...styles.bottomItem,
                ...(active
                    ? styles.bottomItemActive
                    : {})
            }}
        >

            {icon}

            <span>
                {label}
            </span>

        </button>

    );

}


/* STYLES */

const styles = {

    app: {
        minHeight: "100vh",
        background: "#f5f7fb",
        color: "#172033",
        fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        paddingBottom: "82px"
    },


    loadingScreen: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
        color: "#172033"
    },


    loadingCircle: {
        width: "38px",
        height: "38px",
        border: "4px solid #e2e6f0",
        borderTop: "4px solid #4f46e5",
        borderRadius: "50%",
        marginBottom: "14px"
    },


    header: {
        height: "72px",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 18px",
        borderBottom: "1px solid #e7eaf1",
        position: "sticky",
        top: 0,
        zIndex: 20
    },


    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },


    iconButton: {
        width: "42px",
        height: "42px",
        border: "none",
        borderRadius: "12px",
        background: "#f3f5fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "#172033"
    },


    notificationButton: {
        position: "relative",
        width: "42px",
        height: "42px",
        border: "none",
        borderRadius: "12px",
        background: "#f3f5fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "#172033"
    },


    notificationDot: {
        position: "absolute",
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: "#ef4444",
        top: "8px",
        right: "9px",
        border: "2px solid white"
    },


    smallLabel: {
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "1.4px",
        color: "#6366f1"
    },


    headerTitle: {
        margin: "2px 0 0",
        fontSize: "19px",
        fontWeight: "800"
    },


    content: {
        width: "100%",
        maxWidth: "760px",
        margin: "0 auto",
        padding: "18px 16px 28px"
    },


    welcomeCard: {
        background:
            "linear-gradient(135deg, #4f46e5, #2563eb)",
        borderRadius: "22px",
        padding: "24px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "18px",
        boxShadow:
            "0 14px 30px rgba(37, 99, 235, 0.18)"
    },


    welcomeSmall: {
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "1.5px",
        opacity: 0.8
    },


    welcomeTitle: {
        margin: "7px 0 5px",
        fontSize: "24px",
        fontWeight: "800"
    },


    welcomeText: {
        margin: 0,
        fontSize: "13px",
        opacity: 0.85,
        lineHeight: 1.5
    },


    welcomeIcon: {
        width: "56px",
        height: "56px",
        borderRadius: "18px",
        background: "rgba(255,255,255,0.16)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },


    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "12px",
        marginBottom: "24px"
    },


    statCard: {
        background: "white",
        border: "1px solid #e8ebf2",
        borderRadius: "18px",
        padding: "16px",
        minHeight: "120px",
        boxShadow:
            "0 5px 16px rgba(15, 23, 42, 0.04)"
    },


    statIcon: {
        width: "38px",
        height: "38px",
        borderRadius: "12px",
        background: "#eef2ff",
        color: "#4f46e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "12px"
    },


    statLabel: {
        display: "block",
        fontSize: "11px",
        color: "#7b8498",
        marginBottom: "4px"
    },


    statValue: {
        display: "block",
        fontSize: "19px",
        fontWeight: "800"
    },


    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px"
    },


    sectionLabel: {
        display: "block",
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "1.2px",
        color: "#6366f1"
    },


    sectionTitle: {
        margin: "4px 0 0",
        fontSize: "19px",
        fontWeight: "800"
    },


    quickGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "12px"
    },


    quickAction: {
        border: "1px solid #e8ebf2",
        background: "white",
        borderRadius: "17px",
        padding: "14px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        textAlign: "left",
        cursor: "pointer",
        boxShadow:
            "0 5px 16px rgba(15, 23, 42, 0.04)"
    },


    quickIcon: {
        width: "42px",
        height: "42px",
        flexShrink: 0,
        borderRadius: "13px",
        background: "#eef2ff",
        color: "#4f46e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },


    quickText: {
        display: "flex",
        flexDirection: "column",
        gap: "3px"
    },


    quickTextStrong: {
        fontSize: "13px"
    },


    transactionSection: {
        marginTop: "26px"
    },


    viewButton: {
        border: "none",
        background: "transparent",
        color: "#4f46e5",
        fontSize: "12px",
        fontWeight: "700",
        cursor: "pointer"
    },


    transactionCard: {
        background: "white",
        border: "1px solid #e8ebf2",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow:
            "0 5px 16px rgba(15, 23, 42, 0.04)"
    },


    transactionRow: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "15px",
        borderBottom: "1px solid #eef0f5"
    },


    transactionIcon: {
        width: "38px",
        height: "38px",
        flexShrink: 0,
        borderRadius: "11px",
        background: "#eef2ff",
        color: "#4f46e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },


    transactionInfo: {
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },


    transactionAmount: {
        fontSize: "13px",
        whiteSpace: "nowrap"
    },


    emptyState: {
        padding: "35px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#8a93a6"
    },


    inventoryCard: {
        marginTop: "18px",
        background: "white",
        border: "1px solid #e8ebf2",
        borderRadius: "18px",
        padding: "18px",
        display: "flex",
        alignItems: "center",
        gap: "14px"
    },


    inventoryIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "14px",
        background: "#eef2ff",
        color: "#4f46e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
    },


    inventoryInfo: {
        flex: 1
    },


    menuOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        zIndex: 40
    },


sideMenu: {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    width: "290px",
    maxWidth: "85%",
    background: "white",
    zIndex: 50,
    padding: "20px",
    boxShadow:
        "10px 0 30px rgba(15, 23, 42, 0.15)",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch"
},


    menuHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },


    menuTitle: {
        margin: "3px 0 0",
        fontSize: "22px"
    },


    menuUser: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "18px 0",
        marginTop: "12px",
        borderTop: "1px solid #edf0f5",
        borderBottom: "1px solid #edf0f5"
    },


    avatar: {
        width: "44px",
        height: "44px",
        borderRadius: "14px",
        background: "#4f46e5",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        fontWeight: "800"
    },


    menuUserRole: {
        display: "block",
        color: "#8a93a6",
        fontSize: "11px",
        marginTop: "3px"
    },


    menuNavigation: {
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        marginTop: "18px"
    },


    menuItem: {
        width: "100%",
        border: "none",
        background: "transparent",
        padding: "13px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
        color: "#5e687b",
        textAlign: "left",
        fontSize: "14px"
    },


    menuItemActive: {
        background: "#eef2ff",
        color: "#4f46e5",
        fontWeight: "700"
    },


    logoutButton: {
        marginTop: "auto",
        border: "none",
        background: "#fff1f2",
        color: "#e11d48",
        borderRadius: "12px",
        padding: "13px",
        fontWeight: "700",
        cursor: "pointer"
    },


    bottomNav: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "68px",
        background: "rgba(255,255,255,0.97)",
        borderTop: "1px solid #e5e8ef",
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        zIndex: 30,
        boxShadow:
            "0 -5px 20px rgba(15, 23, 42, 0.05)"
    },


    bottomItem: {
        border: "none",
        background: "transparent",
        color: "#8a93a6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        fontSize: "10px",
        cursor: "pointer"
    },


    bottomItemActive: {
        color: "#4f46e5",
        fontWeight: "700"
    }

};


export default MobileAdmin;