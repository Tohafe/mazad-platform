import { useState, useEffect} from 'react'

import useRefreshToken from '../hooks/useRefreshToken'
import { useAuth } from '../context/AuthProvider';
import { Outlet } from 'react-router-dom';
import useUserApi from '../hooks/useUserApi';
import type User from '../types/user';
import DEFAULT_AVATAR from '../assets/avatar.jpg'
import DEFAULT_THUMB from '../assets/avatar_thumb.jpg'

export default function PersistLogin(){
    const refresh = useRefreshToken();
    const [isLoading, setIsLoading] = useState(true);
    const {accessToken, setUser} = useAuth();
    const { getPrivateProfle } = useUserApi();
    
    useEffect(() => {
        let    isMounted = true;

        const getAccessToken =async () => {
            try{
                const refreshResponse = await refresh();
                getPrivateProfle(refreshResponse.accessToken)
                    .then((user: User) => setUser(user))
                    .catch (() => {
                        const updatedUser: User = {
                            ...refreshResponse.user,
                            avatarUrl: DEFAULT_AVATAR,
                            avatarThumbnailUrl: DEFAULT_THUMB
                        }
                        setUser(updatedUser);
                    })
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
            ? <p className='text-secondary text-xl'>loading ...</p>
            : <Outlet/> 
            }
        </>
    )
}