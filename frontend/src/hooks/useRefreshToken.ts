import { useAuth } from "../context/AuthProvider";
import api from "../api/axios";

const useRefreshToken = () => {
    const {setAccessToken} = useAuth();
    
    const refresh = async () => {
        try{
            const response = await api.post('/auth/refresh');
            setAccessToken(response.data);
            return (response.data);
        }catch(err){
            throw err;
        }
    }
    return refresh;
}

export default useRefreshToken;