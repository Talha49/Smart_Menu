"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const AUTH_BYPASS_ENABLED = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";
const BYPASS_USER = {
    _id: "test-bypass-user",
    email: "testing@davoriq.com",
    name: "Testing User",
};

function isAuthBypassActive() {
    if (AUTH_BYPASS_ENABLED) return true;
    if (typeof window === "undefined") return false;
    return window.location.hostname === "davoriq.com" || window.location.hostname === "www.davoriq.com";
}

const AuthContext = createContext({
    user: null,
    loading: true,
    login: async () => { },
    logout: async () => { },
    refresh: async () => { },
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const refresh = useCallback(async () => {
        if (isAuthBypassActive()) {
            setUser(BYPASS_USER);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/me");
            const data = await res.json();
            setUser(data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const login = async (credentials) => {
        if (isAuthBypassActive()) {
            setUser(BYPASS_USER);
            return { success: true };
        }

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        const data = await res.json();
        if (res.ok) {
            setUser(data.user);
            return { success: true };
        }
        return { success: false, error: data.error };
    };

    const logout = async () => {
        if (isAuthBypassActive()) {
            setUser(null);
            router.push("/");
            return;
        }

        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
