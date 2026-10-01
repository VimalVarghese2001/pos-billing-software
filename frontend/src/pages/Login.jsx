import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, Store } from "lucide-react";
import api from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            const role = response.data.user.role;

            if (role === "admin") {
                window.location.href = "/admin/dashboard";
            } else if (role === "staff") {
                window.location.href = "/staff/billing";
            }

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="container">

                <div className="row justify-content-center">

                    <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">

                        <div className="login-card">

                            {/* Logo */}
                            <div className="text-center mb-4">

                                <div className="brand-icon mx-auto mb-3">
                                    <Store size={28} />
                                </div>

                                <h1 className="brand-title">
                                    POS Billing
                                </h1>

                                <p className="brand-subtitle">
                                    Smart Retail Management
                                </p>

                            </div>


                            {/* Heading */}
                            <div className="mb-4">

                                <h2 className="login-title">
                                    Welcome back
                                </h2>

                                <p className="login-description">
                                    Sign in to continue to your account
                                </p>

                            </div>


                            {/* Error */}
                            {error && (
                                <div
                                    className="alert alert-danger py-2"
                                    role="alert"
                                >
                                    {error}
                                </div>
                            )}


                            <form onSubmit={handleLogin}>

                                {/* Email */}
                                <div className="mb-3">

                                    <label className="form-label">
                                        Email Address
                                    </label>

                                    <div className="input-group modern-input">

                                        <span className="input-group-text">
                                            <Mail size={18} />
                                        </span>

                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />

                                    </div>

                                </div>


                                {/* Password */}
                                <div className="mb-4">

                                    <label className="form-label">
                                        Password
                                    </label>

                                    <div className="input-group modern-input">

                                        <span className="input-group-text">
                                            <LockKeyhole size={18} />
                                        </span>

                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className="form-control"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="btn password-button"
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>

                                    </div>

                                </div>


                                {/* Login */}
                                <button
                                    type="submit"
                                    className="btn login-button w-100"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Signing in..."
                                        : "Sign In"}
                                </button>

                            </form>


                            <div className="text-center mt-4">
                                <small className="text-muted">
                                    Secure POS Management System
                                </small>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;