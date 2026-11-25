
import { useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import { Coffee } from "lucide-react";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerHome from "./pages/CustomerHome";

import "./App.css";

function SplashScreen() {
    return (
        <div className="splash-screen">
            <div className="splash-content">
                <div className="splash-logo">
                    <Coffee size={42} strokeWidth={1.7} />
                </div>

                <h1>CAFÉGO<span>.</span></h1>

                <p>YOUR COFFEE, YOUR WAY</p>

                <div className="splash-loader">
                    <div className="splash-loader-progress"></div>
                </div>

                <span className="splash-caption">
                    Brewing your experience...
                </span>
            </div>
        </div>
    );
}

function ProtectedRoute({ children, allowedRole }) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    if (user.role !== allowedRole) {
        return (
            <Navigate
                to={user.role === "admin" ? "/admin" : "/home"}
                replace
            />
        );
    }

    return children;
}

function PublicRoute({ children }) {
    const { user } = useAuth();

    if (user) {
        return (
            <Navigate
                to={user.role === "admin" ? "/admin" : "/home"}
                replace
            />
        );
    }

    return children;
}

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AuthProvider>
            <BrowserRouter>
                {loading ? (
                    <SplashScreen />
                ) : (
                    <Routes>
                        <Route
                            path="/"
                            element={<Navigate to="/login" replace />}
                        />

                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />

                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />

                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute allowedRole="admin">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute allowedRole="customer">
                                    <CustomerHome />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="*"
                            element={<Navigate to="/" replace />}
                        />
                    </Routes>
                )}
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
