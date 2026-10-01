import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/admin/Dashboard";
import Billing from "./pages/staff/Billing";
import Products from "./pages/admin/Products";
import Staff from "./pages/admin/Staff";
import Suppliers from "./pages/admin/Suppliers";
import Transactions from "./pages/admin/Transactions";
import Returns from "./pages/admin/Returns";
import Reports from "./pages/admin/Reports";
import MobileAdmin from "./pages/MobileAdmin";

function ProtectedRoute({ children, role }) {

    const token = localStorage.getItem("token");
    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route path="/login" element={<Login />}/>


                <Route element={
                        <ProtectedRoute role="admin">
                            <AppLayout />
                        </ProtectedRoute>
                    }
                >

                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/products" element={<Products />}/>  
                  <Route path="/admin/staff" element={<Staff />} />
                  <Route path="/admin/suppliers" element={<Suppliers />}/>
                  <Route path="/admin/transactions" element={<Transactions />}/>
                  <Route path="/admin/returns" element={<Returns />} />
                  <Route path="/admin/reports" element={<Reports />} />

                </Route>


                <Route
                    path="/staff/billing"
                    element={
                        <ProtectedRoute role="staff">
                            <Billing />
                        </ProtectedRoute>
                    }
                />

                  <Route
                      path="/mobile-admin"
                      element={
                          <ProtectedRoute role="admin">
                              <MobileAdmin />
                          </ProtectedRoute>
                      }
                  />


                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />


                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;