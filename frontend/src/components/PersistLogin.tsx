import { useState, useEffect} from 'react'

import useRefreshToken from '../hooks/useRefreshToken'
import { useAuth } from '../context/AuthProvider';
import { Outlet } from 'react-router-dom';
import useApiPrivate from '../hooks/useApiPrivate';
import type User from '../types/user';
import DEFAULT_AVATAR from '../assets/avatar.jpg'
import DEFAULT_THUMB from '../assets/avatar_thumb.jpg'

export default function PersistLogin(){
    const refresh = useRefreshToken();
    const [isLoading, setIsLoading] = useState(true);
    const {accessToken, setUser} = useAuth();
    const apiPrivate = useApiPrivate();
    
    useEffect(() => {
        let    isMounted = true;

        const getAccessToken =async () => {
            try{
                const refreshResponse = await refresh();
                try{
                    const user: User = (await apiPrivate.get('/profile'))?.data;
                    setUser(user);
                }catch(error: any){
                    const user : User = refreshResponse.user;
                    user.avatarUrl = DEFAULT_AVATAR;
                    user.avatarThumbnailUrl = DEFAULT_THUMB;
                    setUser(refreshResponse.user);
                }
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
            ? <p className='text-secondary text-xl'>loading ...</p> // put here what the user should see on loading 
            : <Outlet/> 
            }
        </>
    )
}