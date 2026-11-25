
import { createContext, useContext, useState } from "react";

import {
    loginUser,
    registerUser,
    getCurrentUser,
    logoutUser
} from "../services/storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getCurrentUser);

    const login = (email, password) => {
        const loggedUser = loginUser(email, password);
        setUser(loggedUser);
        return loggedUser;
    };

    const register = (name, email, password) => {
        return registerUser(name, email, password);
    };

    const logout = () => {
        logoutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
