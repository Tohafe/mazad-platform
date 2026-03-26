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
    setShowUsernameEdit : (show : boolean) => void
}

const schema = z.object({
    username: z.string()
        .regex(/^[a-zA-Z]{3}/, "must start with at least 3 letters")
        .min(4, "must be at least 4 characters")
        .max(20,"must be less than 20 characters")
});

type FormData = z.infer<typeof schema>;


export default function ResetUsernameForm({setShowUsernameEdit} : Props){

    const {register, handleSubmit, formState: {errors, isSubmitting}, setError} = useForm<FormData>({
        resolver: zodResolver(schema)
    });
    const ref = useRef<HTMLFormElement>(null);
    useOnClickOutside(ref, () => {setShowUsernameEdit(false)});

    const api = useApiPrivate();
    const {user, setUser} = useAuth();

    const onSubmit = async (data: FormData) => {
        if (data.username === user?.username){
            setError('username', {message: 'Please enter a different username'});
            return;
        }
        try{
            await api.patch('/auth/reset/username', data);
            if (user){
                setUser({...user , username: data.username});
            }
            setShowUsernameEdit(false);
        }
        catch (errors: any){
            setError('root', {message: errors?.response?.data?.detail || 'An unexpected error occurred, Please try later.'})
        }
    }

    return (
        <form ref={ref} className="space-y-3 w-full" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-center text-xl">Change username</h2>
            <div className="w-full h-[0.5px] bg-border my-5"></div>
            <Input {...register('username')} error={errors.username?.message} label="New username"></Input>
            {errors.root &&
                <span className="text-red-600 text-sm">{errors.root.message } </span>}
            <Button type="submit" className="w-full mt-3" disabled={isSubmitting}>
                {!isSubmitting  ? 'Save'
                    : <CgSpinner className="text-4xl text-gray-300 animate-spin"> </CgSpinner>}
            </Button>
            <Button
                className="w-full text-secondary bg-white border border-gray-400"
                onClick={() => {setShowUsernameEdit(false)}}
            >
                Cancel
            </Button>
        </form>
    )
}