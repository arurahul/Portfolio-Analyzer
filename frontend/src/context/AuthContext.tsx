    import React, { createContext, useState, useEffect, ReactNode } from "react";
    import jwtDecode from "jwt-decode";
    import api from "../services/api";

    type User = { email: string; department: string; clearance: string };

    type AuthContextType = {
    user: User | null;
    tempToken: string | null; 
    login: (email: string, password: string) => Promise<void>;
    verify2FA: (code: string) => Promise<void>;
    logout: () => void;
    refreshAccessToken: () => Promise<string | null>;
    };

    export const AuthContext = createContext<AuthContextType | null>(null);

    export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [tempToken, setTempToken] = useState<string | null>(null);

    // Load token on mount
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
        try {
            const decoded = jwtDecode<User>(token);
            setUser(decoded);
        } catch {
            localStorage.removeItem("accessToken");
        }
        }
    }, []);

    // Login: get temp token
    const login = async (email: string, password: string) => {
        const response = await api.post("/login", { email, password });
        const { access_token } = response.data;
        setTempToken(access_token);
    };

    // Verify 2FA: finalize login
    const verify2FA = async (code: string) => {
        if (!tempToken) throw new Error("No temporary token available");

        const response = await api.post(
        "/2fa-verify",
        { code },
        { headers: { Authorization: `Bearer ${tempToken}` } }
        );

        if (response.status !== 200) {
        const data = await response.json();
        throw new Error(data.error || "2FA verification failed");
        }

        // Success: store token
        localStorage.setItem("accessToken", tempToken);
        const decoded = jwtDecode<User>(tempToken);
        setUser(decoded);
        setTempToken(null);
    };

    // Logout
    const logout = () => {
        setUser(null);
        setTempToken(null);
        localStorage.removeItem("accessToken");
    };

    // Refresh access token
    const refreshAccessToken = async (): Promise<string | null> => {
        try {
        const response = await api.post("/auth/refresh", {}, { withCredentials: true });
        const { access_token } = response.data;

        localStorage.setItem("accessToken", access_token);
        const decoded = jwtDecode<User>(access_token);
        setUser(decoded);

        return access_token;
        } catch {
        logout();
        return null;
        }
    };

    return (
        <AuthContext.Provider
        value={{ user, tempToken, login, verify2FA, logout, refreshAccessToken }}
        >
        {children}
        </AuthContext.Provider>
    );
    }
