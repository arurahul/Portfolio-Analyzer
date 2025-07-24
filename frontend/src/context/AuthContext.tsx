import {createContext, useState} from 'react';
import {jwtDecode} from 'jwt-dcode';

type User={email: string , department:string,clearance:string};

export const AuthContext=createContext<{
user:User|null;
login :(emails:string,password:string)=> Promise<void>;
logout :()=>void;

}>(null)

export function AuthProvider({children}:{children:React.ReactNode})
{
        const [user, setUser] = useState<User | null>(null);
        const login =async(email:string,password:string)=>{
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
                });
            const  {accesstoken} = await response.json();
            const decoded=jwtDecode<{
                emails:string;
                department:string;
                clearance:string;
            }>(accesstoken)
            localStorage.setItem("accessToken",accesstoken)
            setUser(decoded);
            };

            const logout=()=>{
                localStroage.removeItem("accessToken")
                setUser(null)

            };
        return(
            <AuthContext.Provider value={{user,login,logout}}>
                {childern}
            </AuthContext.Provider>
        );
}