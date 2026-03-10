import { useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {apiPrivate} from "../api/axios";
import { useAuth } from "../context/AuthProvider";
import useRefreshToken from "./useRefreshToken";

const useApiPrivate = () =>{
    const {accessToken} = useAuth();
    const refresh = useRefreshToken();
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        const requestIntercept = apiPrivate.interceptors.request.use(
            (config) => {
                if (!config.headers.Authorization)
                    config.headers.Authorization = `Bearer ${accessToken}`;
                return config;
            },
            (error) => Promise.reject(error)
        );
        
        const responseIntercept = apiPrivate.interceptors.response.use(        
            (response) => response,
            async (error) => {
                const prevRequest = error.config;

                if (error.response?.status === 401 && !prevRequest.sent){
                    prevRequest.sent = true;
                    try {
                        const response = await refresh();
                        prevRequest.headers.Authorization = `Bearer ${response.accessToken}`;
                        return apiPrivate(prevRequest);
                    }catch(err){
                        navigate('/login', {state: {from: location}});
                        return Promise.reject(err);
                    }
                }
                return Promise.reject(error);
            }
        )
        return () => {
            apiPrivate.interceptors.request.eject(requestIntercept);
            apiPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [accessToken]);
    return (apiPrivate);
}

export default useApiPrivate;   