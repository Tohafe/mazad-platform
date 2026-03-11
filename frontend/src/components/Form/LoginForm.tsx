import { Link , useNavigate, useLocation } from "react-router-dom";
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { CgSpinner } from "react-icons/cg";

import Input from "../Input/Input";
import Button from "../Button/Button";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthProvider";
import type User from "../../types/user";
import useUserApi from "../../hooks/useUserApi";

import DEFAULT_AVATAR from '../../../../resources/images/avatar.jpg'
import DEFAULT_THUMB from '../../../../resources/images/avatar_thumb.jpg'
import { useEffect } from "react";


const schema = z.object({
    email: z.email(),
    password: z.string()
        .min(8)
        .max(30)
});

type LoginData = z.infer<typeof schema>;

export default function Login(){

    const {register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<LoginData>({
        resolver: zodResolver(schema)
    });

    const {setAccessToken, setUser, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const {getPrivateProfle} = useUserApi();
    const from = location.state?.from;

    
    useEffect(() => {
        if (isAuthenticated)
            navigate(from?.pathname || '/');
}, []);


const onSubmit = async (data: LoginData) => {
    let message : string = '';
    
    try{
        const login = await api.post('/auth/login', data);
        setAccessToken(login.data?.accessToken);
        getPrivateProfle(login.data?.accessToken)
            .then((user: User) => setUser(user))
            .catch (() => {
                const updatedUser: User = {
                    ...login.data?.user,
                    avatarUrl: DEFAULT_AVATAR,
                    avatarThumbnailUrl: DEFAULT_THUMB
                }
                setUser(updatedUser);
            })
        navigate(from?.pathname || '/');
    }catch(errors: any){
        setAccessToken(null);
        if (errors.response?.status !== 401){
            message = "An unexpected error occurred, Please try later.";
        }
        setError('root', {message: message});
    }
    }


    return (
        <div className="bg-white z-20 shadow-2xl border border-gray-200 p-3 w-87  sm:w-110 sm:p-5">
            <div className='flex items-center justify-between mb-10'>
                <h1 className='font-medium text-xl'>Welcome back!</h1>
                <Link to = '/register' state={{ from: from }} replace={true}  className='text-brand mt-6'>Create account</Link>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <Input {...register("email")}
                    label="Email Address"
                ></Input>

                <Input {...register("password")}
                    label="Password"
                    isPass={true}
                ></Input>

               {(errors.email || errors.password || errors.root) &&
                <span className="text-red-500 text-sm ml-2">
                    {errors.root?.message || "Invalid email or password"}
                </span>
                } 

                <p className='text-xs mt-5 text-gray-600 '>By signing in, you agree to our 
                <Link to='/terms-of-service' className="text-brand"> Terms of Service</Link>
                </p>
                <Button type="submit" className="w-full mt-3" disabled={isSubmitting} >
                    {!isSubmitting ? "Sign in" :
                        <CgSpinner className="text-4xl text-gray-300 animate-spin"> </CgSpinner>}
                </Button>
            </form>

        </div>
    )
}