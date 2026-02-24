import { createContext, useContext, useState, type ReactNode} from "react";

interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);


const AuthProvider = ({ children }:  {children: ReactNode}) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    return (
        <AuthContext.Provider value={
            {
                accessToken,
                setAccessToken,
                isAuthenticated: !!accessToken
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
