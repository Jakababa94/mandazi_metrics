import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/schema';
import { authService } from '../services/authService';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('mandazi_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const user = await authService.login(email, password);
        setUser(user);
        localStorage.setItem('mandazi_user', JSON.stringify(user));
    };

    const signup = async (name: string, email: string, password: string) => {
        const user = await authService.signup(name, email, password);
        setUser(user);
        localStorage.setItem('mandazi_user', JSON.stringify(user));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('mandazi_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
