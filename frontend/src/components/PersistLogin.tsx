import { useState, useEffect} from 'react'

import useRefreshToken from '../hooks/useRefreshToken'
import { useAuth } from '../context/AuthProvider';
import { Outlet } from 'react-router-dom';

export default function PersistLogin(){
    const refresh = useRefreshToken();
    const [isLoading, setIsLoading] = useState(true);
    const {accessToken} = useAuth();
    
    useEffect(() => {
        let    isMounted = true;

        const getAccessToken =async () => {
            try{
                await refresh();
                // await new Promise(() => setTimeout(() => {}, 3000));
            }catch(error: any){
            }finally{
                isMounted && setIsLoading(false);
            }
        }

        !accessToken ? getAccessToken() : setIsLoading(false);

        return () => {isMounted = false};
    }, [])

    return (
        <>
            {isLoading
            ? <p>Cheking Authentication ...</p> // put here what the user should see on loading 
            : <Outlet/> 
            }
        </>
    )
}