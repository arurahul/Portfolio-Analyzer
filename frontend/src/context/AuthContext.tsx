    import { createContext, useState } from 'react';
    import jwtDecode from 'jwt-decode';

    type User = { email: string; department: string; clearance: string };

    export const AuthContext = createContext<{
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    } | null>(null);

    export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [tempToken, setTempToken] = useState<string | null>(null);

    const login = async (email: string, password: string) => {
        const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        });

        if(!response.ok) throw new Error('Invalid Login Details')

        const { access_token } = await response.json();
        setTempToken(access_token);
    };

    const verify2FA=async(code:string)=>{
        if(!tempToken) throw new Error("No Token available")
        const response=await fetch("http://localhost:5000/2fa-verify",{
        method:'POST',
        headers:{'Content-Type':'application/json',
            Authorization: `Bearer ${tempToken}`,
        },
        body: JSON.stringify({ code }),
        })
        if (!response.ok) 
            {
            const data = await response.json();
            throw new Error(data.error || '2FA verification failed');
            }

        // 2FA success: decode token and finalize login
        const decoded = jwtDecode<User>(tempToken);
        setUser(decoded);
        localStorage.setItem('accessToken', tempToken);
        setTempToken(null); // Clear temp token
        
    }
    const logout = () => {
        setUser(null);
        setTempToken(null);
        localStorage.removeItem("accessToken");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
    }
