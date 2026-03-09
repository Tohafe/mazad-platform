import { useAuth } from "../context/AuthProvider";

import { Outlet, Navigate, useLocation} from "react-router-dom";

export default function RequireAuth(){
    const {isAuthenticated} = useAuth();
    const location = useLocation();

    return(
        isAuthenticated
            ? <Outlet/>
            : <Navigate to={'/login'} state={{from: location}}/>
    );
}