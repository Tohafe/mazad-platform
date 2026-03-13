import {useForm, type SubmitHandler} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import { CgSpinner } from "react-icons/cg";
import { Link, useNavigate, useLocation } from 'react-router-dom';

import api from '../../api/axios';

import Button from "../Button/Button";
import Input from "../Input/Input";
import { useAuth } from '../../context/AuthProvider';
import { useEffect, useMemo } from 'react';

const schema = z.object({

    confirmPassword: z.string(),
    username: z.string()
        .regex(/^[a-zA-Z]{3}/, "must start with at least 3 letters")
        .min(4, "must be at least 4 characters")
        .max(20,"must be less than 20 characters"),
    email: z.email("Invalid Email Address"),
    password: z.string()
        .regex(/[A-Z]/, "must contain at least one uppercase letter")
        .regex(/[a-z]/, "must contain at least one lowercase letter")
        .regex(/[0-9]/, "must contain at least one number")
        .regex(/[\W]/, "must contain at least one special character")
        .min(8, "must be at least 8 characters")
        .max(30, "must be less than 30 characters")
}).refine((data) => data.password === data.confirmPassword,
    {message: "Passwords do not match",
    path: ["confirmPassword"]});

type RegisterData = z.infer<typeof schema>;

export default function RegisterForm(){
    const navigate = useNavigate();
    const location = useLocation();
    const {isAuthenticated} = useAuth();
    
    const from = useMemo(() => {
        return location.state?.from || '/';
    }, []);

    const {register,
        handleSubmit,
        formState: {errors, isSubmitting},
        setError
    } = useForm<RegisterData>({
        resolver: zodResolver(schema)
    })
    
    
    useEffect(() => {
        if (isAuthenticated)
            navigate(from, {state: {from: from}});
}, []);

const onSubmit: SubmitHandler<RegisterData> = async (data: RegisterData) =>{
    try {
            await api.post('/auth/register', data);0.
            navigate('/login', { state: { from: from }});
        }catch(error: any){
            let feildName = error.response?.data?.field;
            let message = error.response?.data?.detail;
            if (!feildName)
                feildName = "root";
            if (!message)
                message = "An unexpected error occurred, Please try later."
            setError(feildName, {message: message});
        }
}
    
    return (
        <div className="bg-white z-20 shadow-2xl border border-gray-200 p-3 w-87  sm:w-110 sm:p-5">
            <div className='flex items-center justify-between mb-10'>
                <h1 className='font-medium text-xl'>Create account</h1>
                <Link to = '/login' state={{ from: from }} className='text-brand mt-6'>Sign in</Link>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
                <Input error={errors.username?.message} { ...register("username")} label="Userame"></Input>
                <Input error={errors.email?.message} {...register("email")} label="Email"></Input>
                <Input isPass={true} error={errors.password?.message} {...register("password")} label="Password"></Input>
                <Input isPass={true} error={errors.confirmPassword?.message} {...register("confirmPassword")} label="Confirm Password"></Input>
                {errors.root && (
                    <span className="text-red-500 text-sm ml-2">
                        {errors.root.message}
                    </span>
                )}
                <p className='text-xs mt-4 text-gray-600'>By creating an account, you agree to our <Link to='/terms-of-service' className='text-brand'> Terms of Service</Link> and acknowledge our
                <Link to='/privacy-policy' className='text-brand'> Privacy Policy</Link>.
                Depending on how you use Mazad, we may send you promotional emails.</p>
                <Button type="submit" className="w-full mt-5" disabled={isSubmitting} >
                    {!isSubmitting ? "Agree and continue"
                        : <CgSpinner className='animate-spin text-4xl text-gray-300'> </CgSpinner>}
                </Button>
            </form>
        </div>
    );
}     