import { createContext, useContext, useState, type ReactNode} from "react";

interface User{
    id: string | null;
    username: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    avatarUrl: string | null;
    avatarThambnailUrl: string | null;
    phoneNumber: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    isComplete: boolean;
}

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

export const useAuth = () =>{
    const context = useContext(AuthContext);

    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
} 


export default AuthProvider;
