
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Coffee,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();
        setError("");

        if (name.trim().length < 2) {
            setError("Please enter your full name.");
            return;
        }

        if (password.length < 6) {
            setError("Password must have at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            register(name.trim(), email.trim(), password);

            alert("Account created successfully! Please log in.");

            navigate("/login");

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
                            JOIN THE CAFÉGO COMMUNITY
                        </span>

                        <h1>
                            Good coffee.
                            <br />
                            Great company.
                        </h1>

                        <p>
                            Create your account and enjoy your
                            favorite drinks and snacks anytime.
                        </p>

                        <div className="visual-decoration">
                            ☕ 🥐 🍩
                        </div>
                    </div>

                    <p className="visual-footer">
                        Your little café corner awaits.
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
                            CREATE YOUR ACCOUNT
                        </span>

                        <h2>Join CaféGo</h2>

                        <p>
                            Sign up and discover your new
                            favorite café experience.
                        </p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>

                        <label>Full Name</label>

                        <div className="auth-input">
                            <User size={19} />

                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

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
                                placeholder="Minimum 6 characters"
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

                        <label>Confirm Password</label>

                        <div className="auth-input">
                            <Lock size={19} />

                            <input
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="auth-submit">
                            Create Account
                            <ArrowRight size={19} />
                        </button>

                    </form>

                    <div className="auth-divider">
                        <span>OR</span>
                    </div>

                    <p className="auth-switch">
                        Already have an account?
                        <Link to="/login"> Sign In</Link>
                    </p>

                    <p className="auth-copyright">
                        © 2026 CaféGo. All rights reserved.
                    </p>

                </div>
            </div>

        </div>
    );
}

export default Register;
