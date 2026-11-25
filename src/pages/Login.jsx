
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Coffee,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");

        try {
            const user = login(email.trim(), password);

            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/home");
            }

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-visual">
                <div className="visual-overlay">
                    <div className="visual-brand">
                        <Coffee size={32} />
                        <span>CAFÉGO</span>
                    </div>

                    <div className="visual-content">
                        <span className="visual-tag">
                            YOUR COFFEE, YOUR WAY
                        </span>

                        <h1>
                            A little coffee.
                            <br />
                            A lot of happiness.
                        </h1>

                        <p>
                            Discover your favorite drinks, delicious
                            snacks, and beautiful moments with CaféGo.
                        </p>

                        <div className="visual-decoration">
                            ☕ 🥐 🍪
                        </div>
                    </div>

                    <p className="visual-footer">
                        Freshly made. Lovingly served.
                    </p>
                </div>
            </div>

            <div className="auth-form-side">
                <div className="auth-card">

                    <div className="mobile-brand">
                        <Coffee size={28} />
                        <span>CAFÉGO</span>
                    </div>

                    <div className="auth-heading">
                        <span className="eyebrow">
                            WELCOME BACK
                        </span>

                        <h2>Sign in to CaféGo</h2>

                        <p>
                            Your favorite coffee and snacks are
                            just a few clicks away.
                        </p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>

                        <label>Email Address</label>

                        <div className="auth-input">
                            <Mail size={19} />

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <label>Password</label>

                        <div className="auth-input">
                            <Lock size={19} />

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ?
                                    <EyeOff size={19} /> :
                                    <Eye size={19} />
                                }
                            </button>
                        </div>

                        <button type="submit" className="auth-submit">
                            Sign In
                            <ArrowRight size={19} />
                        </button>

                    </form>

                    <div className="auth-divider">
                        <span>OR</span>
                    </div>

                    <p className="auth-switch">
                        Don't have an account?
                        <Link to="/register"> Create Account</Link>
                    </p>

                    <div className="demo-accounts">
                        <p>DEMO ACCOUNTS</p>

                        <div>
                            <strong>Admin:</strong>
                            admin@cafego.com / admin123
                        </div>

                        <div>
                            <strong>Customer:</strong>
                            customer@cafego.com / customer123
                        </div>
                    </div>

                    <p className="auth-copyright">
                        © 2026 CaféGo. All rights reserved.
                    </p>

                </div>
            </div>

        </div>
    );
}

export default Login;
