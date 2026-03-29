import Button from "../Button/Button";
import Input from "../Input/Input";
import { useForm } from "react-hook-form";
import z  from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import useApiPrivate from "../../hooks/useApiPrivate";
import { CgSpinner } from "react-icons/cg";
import { useOnClickOutside } from "../Notification/NotificationBell";
import { useRef } from "react";

interface Props {
    setShowPassEdit : (show : boolean) => void
}

const schema = z.object({
    password: z.string().min(8, "Invalid Password"),
    newPassword: z.string("Invalid Password")
        .regex(/[A-Z]/, "must contain at least one uppercase letter")
        .regex(/[a-z]/, "must contain at least one lowercase letter")
        .regex(/[0-9]/, "must contain at least one number")
        .regex(/[\W]/, "must contain at least one special character")
        .min(8, "must be at least 8 characters")
        .max(30, "must be less than 30 characters"),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword,
        {message: "Passwords do not match",
        path: ["confirmPassword"]});

type FormData = z.infer<typeof schema>;


export default function ResetPasswordForm({setShowPassEdit} : Props){

    const {register, handleSubmit, formState: {errors, isSubmitting}, setError} = useForm<FormData>({
        resolver: zodResolver(schema)
    });
    const api = useApiPrivate();
    const ref = useRef<HTMLFormElement>(null);
    useOnClickOutside(ref, () => setShowPassEdit(false));
    
    const onSubmit = async (data: FormData) => {
        try{
            await api.patch('/auth/reset/password', data);
            setShowPassEdit(false);
        }
        catch (errors: any){
            console.log(errors.response.data);
            setError('root', {message: errors?.response?.data?.detail || 'An unexpected error occurred, Please try later.'})
        }
    }

    return (
        <form ref={ref} className="space-y-3 w-full" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-center text-xl">Change Password</h2>
            <div className="w-full h-[0.5px] bg-border my-5"></div>
            <Input {...register('password')} error={errors.password?.message} isPass={true} label="Password"></Input>
            <Input {...register('newPassword')} error={errors.newPassword?.message} isPass={true} label="New password"></Input>
            <Input {...register('confirmPassword')} error={errors.confirmPassword?.message} isPass={true} label="Confirm password"></Input>
            {errors.root && 
                <span className="text-error text-sm">{errors.root.message } </span>}
            <Button type="submit" className="w-full mt-3" disabled={isSubmitting}>
                {!isSubmitting  ? 'Save'
                                : <CgSpinner className="text-4xl text-gray-300 animate-spin"> </CgSpinner>}
            </Button>
            <Button 
                className="w-full text-secondary bg-white border border-gray-400"
                onClick={() => {setShowPassEdit(false)}}
            >
                Cancel
            </Button>
        </form>
    )
}