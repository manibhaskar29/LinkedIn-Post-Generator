import { createContext, useContext, useState } from "react";
import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("access_token"));

    const login = async (email, password) => {
        const data = await apiRequest(
            `/auth/login?email=${email}&password=${password}`,
            "POST"
        );

        localStorage.setItem("access_token", data.access_token);
        setToken(data.access_token);
    };

    const signup = async (email, password) => {
        await apiRequest(
            `/auth/signup?email=${email}&password=${password}`,
            "POST"
        );
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}