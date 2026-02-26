import { Link , useNavigate, useLocation} from "react-router-dom";
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { CgSpinner } from "react-icons/cg";

import Input from "../Input/Input";
import Button from "../Button/Button";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthProvider";
import useApiPrivate from "../../hooks/useApiPrivate";
import type User from "../../types/user";

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

    const {setAccessToken, setUser} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const apiPrivate = useApiPrivate();

    const onSubmit = async (data: LoginData) => {
        let message : string = '';

        try{
            const login = await api.post('/auth/login', data);
            setAccessToken(login.data?.accessToken);
            try{
                const user: User = (await apiPrivate.get('/profile')).data;
                setUser(user);
            }catch(errors: any){
                setUser(login.data?.user);
            }
            navigate(from);
        }catch(errors: any){
            setAccessToken(null);
            if (errors.response?.status !== 401){
                message = "An unexpected error occurred, Please try later.";
            }
            setError('root', {message: message});
        }
    }


    return (
        <div className="border p-3 w-95">
            <div className='flex items-center justify-between mb-10'>
                <h1 className='font-medium text-xl'>Welcome back!</h1>
                <Link to = '/register' className='text-brand mt-6'>Create account</Link>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input {...register("email")}
                    label="Email Address"
                ></Input>

                <Input {...register("password")}
                    type='password'
                    label="Password"
                ></Input>

               {(errors.email || errors.password || errors.root) &&
                <span className="text-red-500 text-sm ml-2">
                    {errors.root?.message || "Invalid email or password"}
                </span>
                } 

                <p className='text-xs mt-5 text-gray-600 pt-3'>By signing in, you agree to our 
                <Link to='/term-of-use' className="text-brand"> Terms of Use</Link>
                </p>
                <Button type="submit" className="w-full mt-5" disabled={isSubmitting} >
                    {!isSubmitting ? "Sign in" :
                        <CgSpinner className="text-4xl text-gray-300 animate-spin"> </CgSpinner>}
                </Button>
            </form>

        </div>
    )
}