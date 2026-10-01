import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Users,
    Truck,
    ReceiptText,
    RotateCcw,
    BarChart3,
    Menu,
    Bell,
    LogOut,
    X
} from "lucide-react";

function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const menuItems = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/admin/dashboard"
        },
        {
            name: "Products",
            icon: Package,
            path: "/admin/products"
        },
        {
            name: "Staff",
            icon: Users,
            path: "/admin/staff"
        },
        {
            name: "Suppliers",
            icon: Truck,
            path: "/admin/suppliers"
        },
        {
            name: "Transactions",
            icon: ReceiptText,
            path: "/admin/transactions"
        },
        {
            name: "Returns",
            icon: RotateCcw,
            path: "/admin/returns"
        },
        {
            name: "Reports",
            icon: BarChart3,
            path: "/admin/reports"
        }
    ];

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const goTo = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    return (
        <div className="app-shell">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`app-sidebar ${
                    sidebarOpen ? "sidebar-open" : ""
                }`}
            >

                <div className="sidebar-brand">

                    <div className="sidebar-logo">
                        <ReceiptText size={22} />
                    </div>

                    <div>
                        <h5>POS Billing</h5>
                        <span>Management</span>
                    </div>

                    <button
                        className="mobile-close-btn"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>

                </div>


                <div className="sidebar-section-title">
                    MAIN MENU
                </div>


                <nav className="sidebar-menu">

                    {menuItems.map((item) => {

                        const Icon = item.icon;

                        return (
                            <button
                                key={item.name}
                                className="sidebar-link"
                                onClick={() => goTo(item.path)}
                            >
                                <Icon size={19} />
                                <span>{item.name}</span>
                            </button>
                        );
                    })}

                </nav>


                <div className="sidebar-bottom">

                    <button
                        className="sidebar-link logout-link"
                        onClick={logout}
                    >
                        <LogOut size={19} />
                        <span>Logout</span>
                    </button>

                </div>

            </aside>


            {/* Main */}
            <main className="app-main">

                {/* Topbar */}
                <header className="app-topbar">

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={22} />
                    </button>


                    <div className="topbar-title">
                        <span>POS Management</span>
                    </div>


                    <div className="topbar-actions">

                        <button className="notification-btn">
                            <Bell size={20} />
                            <span />
                        </button>


                        <div className="user-profile">

                            <div className="user-avatar">
                                {(user.name || "A")
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="user-info">
                                <strong>
                                    {user.name || "Admin"}
                                </strong>

                                <small>
                                    {user.role || "admin"}
                                </small>
                            </div>

                        </div>

                    </div>

                </header>


                {/* Page */}
                <div className="app-content">
                    <Outlet />
                </div>


                {/* Mobile navigation */}
                <nav className="mobile-bottom-nav">

                    <button onClick={() => goTo("/admin/dashboard")}>
                        <LayoutDashboard size={20} />
                        <span>Home</span>
                    </button>

                    <button onClick={() => goTo("/admin/products")}>
                        <Package size={20} />
                        <span>Products</span>
                    </button>

                    <button onClick={() => goTo("/admin/transactions")}>
                        <ReceiptText size={20} />
                        <span>Sales</span>
                    </button>

                    <button onClick={() => goTo("/admin/reports")}>
                        <BarChart3 size={20} />
                        <span>Reports</span>
                    </button>

                </nav>

            </main>

        </div>
    );
}

export default AppLayout;