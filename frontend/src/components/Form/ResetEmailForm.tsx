import Button from "../Button/Button";
import Input from "../Input/Input";
import { useForm } from "react-hook-form";
import z  from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import useApiPrivate from "../../hooks/useApiPrivate";
import { useAuth } from "../../context/AuthProvider";
import { CgSpinner } from "react-icons/cg";
import { useOnClickOutside } from "../Notification/NotificationBell";
import { useRef } from "react";

interface Props {
    setShowEmailEdit : (show : boolean) => void
}

const schema = z.object({
    email : z.email("Invalid Email"),
    password: z.string().min(8, "Invalid Password"),
});

type FormData = z.infer<typeof schema>;


export default function ResetEmailForm({setShowEmailEdit} : Props){

    const {register, handleSubmit, formState: {errors, isSubmitting}, setError} = useForm<FormData>({
        resolver: zodResolver(schema)
    });
    const ref = useRef<HTMLFormElement>(null);
    useOnClickOutside(ref, () => {setShowEmailEdit(false)});

    const api = useApiPrivate();
    const {user, setUser} = useAuth();
    
    const onSubmit = async (data: FormData) => {
        if (data.email === user?.email){
            setError('email', {message: 'Please enter a different email'});
            return;
        }
        try{
            await api.patch('/auth/reset/email', data);
            let newData = user;
            if (newData){
                newData.email = data.email;
                setUser(newData);
            }
            setShowEmailEdit(false);
        }
        catch (errors: any){
            setError('root', {message: errors?.response?.data?.detail || 'An unexpected error occurred, Please try later.'})
        }
    }

    return (
        <form ref={ref} className="space-y-3 w-full" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-center text-xl">Change email address</h2>
            <div className="w-full h-[0.5px] bg-border my-5"></div>
            <Input {...register('email')} error={errors.email?.message} label="New email"></Input>
            <Input {...register('password')} error={errors.password?.message} type='password' label="Password"></Input>
            {errors.root && 
                <span className="text-red-600 text-sm">{errors.root.message } </span>}
            <Button type="submit" className="w-full mt-3" disabled={isSubmitting}>
                {!isSubmitting  ? 'Save'
                                : <CgSpinner className="text-4xl text-gray-300 animate-spin"> </CgSpinner>}
            </Button>
            <Button 
                className="w-full text-secondary bg-white border border-gray-400"
                onClick={() => {setShowEmailEdit(false)}}
            >
                Cancel
            </Button>
        </form>
    )
}