import {useEffect} from 'react'

import useRefreshToken from '../hooks/useRefreshToken'
import { useAuth } from '../context/AuthProvider';
import { Outlet } from 'react-router-dom';
import useUserApi from '../hooks/useUserApi';
import type User from '../types/user';
import {avatar, avatar_thumbnail} from '../assets/avatar.ts'

export default function PersistLogin(){
    const refresh = useRefreshToken();
    const {accessToken, setUser, isLoading, setIsLoading} = useAuth();
    const { getPrivateProfle } = useUserApi();
    
    useEffect(() => {

        const getAccessToken = async () => {
            try{
                const refreshResponse = await refresh();
                getPrivateProfle(refreshResponse.accessToken)
                    .then((user: User) => setUser(user))
                    .catch (() => {
                        const updatedUser: User = {
                            ...refreshResponse.user,
                            avatarUrl: avatar,
                            avatarThumbnailUrl: avatar_thumbnail
                        }
                        setUser(updatedUser);
                    })
            }catch(error: any){
            }finally{
                setIsLoading(false);
            }
        }
        !accessToken ? getAccessToken() : setIsLoading(false);
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