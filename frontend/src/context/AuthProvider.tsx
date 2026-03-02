import { createContext, useContext, useState, type ReactNode} from "react";
import type User from '../types/user'

interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    isAuthenticated: boolean;
    user: User | null;
    setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null);


const AuthProvider = ({ children }:  {children: ReactNode}) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] =  useState<User | null> (null);

    return (
        <AuthContext.Provider value={
            {
                accessToken: accessToken,
                setAccessToken: setAccessToken,
                isAuthenticated: !!accessToken,
                user: user,
                setUser: setUser
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () =>{4
    const context = useContext(AuthContext);

    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
} 


export default AuthProvider;
