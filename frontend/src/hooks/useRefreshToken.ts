import { useAuth } from "../context/AuthProvider";
import api from "../api/axios";

const useRefreshToken = () => {
    const {setAccessToken} = useAuth();
    
    const refresh = async () => {
        try{
            const response = await api.post('/auth/refresh');
            setAccessToken(response.data?.accessToken);
            return (response.data);
        }catch(err){
            setAccessToken(null);
            throw err;
        }
    }
    return refresh;
}

export default useRefreshToken;