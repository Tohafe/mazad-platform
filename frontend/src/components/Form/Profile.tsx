import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthProvider"
import Button from "../Button/Button";
import Input from "../Input/Input";
import { useForm } from "react-hook-form";
import z from 'zod'
import Select from "../Input/Select";
import useApiPrivate from "../../hooks/useApiPrivate";
import type User from "../../types/user";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { AiOutlineEdit } from "react-icons/ai";
import IconButton from "../Button/IconButton";

const countries = ["Morocco"];

const schema = z.object({
    firstName : z.string()
        .trim()
        .min(3, "must be at least 3 characters")
        .max(15,"must be less than 15 characters")
        .regex(/^[A-Za-z\s]+$/, 'Invalid first name'),
    lastName : z.string()
        .trim()
        .min(3, "must be at least 3 characters")
        .max(15,"must be less than 15 characters")
        .regex(/^[A-Za-z\s]+$/, 'Invalid first name'),
    phoneNumber : z.string()
        .min(10, "Invalid phone number")
        .max(10, "Invalid phone number")
        .regex(/^[0-9]+$/, "Invalid phone number")
        .startsWith("0"),
    bio : z.string()
            .max(500, "must be less than 500 characters"),
    country : z.enum(countries, 'Please select a supported country from the list'),
    city : z.string()
            .min(2, "must be at least 2 characters")
            .max(20, "must be less than 20 characters"),
    address : z.string()
        .min(10, "must be at least 10 characters")
        .max(200, "must be less than 200 characters"),
})

type ProfileData = z.infer<typeof schema>;

export default function Profile(){
    const {user, setUser} = useAuth();
    const api = useApiPrivate();
    const [success, setSuccess] = useState(false);


    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        setError
    } = useForm<ProfileData>({
        resolver: zodResolver(schema)
    });


    const getDiff = (original: User, modified: ProfileData) : Partial<ProfileData> =>{
        return Object
                .keys(modified)
                .reduce((result, key) => {
                    const k = key as keyof ProfileData;
                    if (original[k] !== modified[k])
                        result[k] = modified[k];
                    return result;
                }, {} as Partial<ProfileData>);
    }

    const onSubmit = async (data: ProfileData)=> {
        if (!user?.isComplete){
            try{
                
                const profile : User = (await api.post('/profile', data)).data;
                setUser(profile);
                setSuccess(true);
            }catch(errors: any){
                setSuccess(false);
                console.log(errors.response.data);
                setError('root', {message: 'An unexpected error occurred, Please try later.'})
            }
        }
        else{
            try{
                const changed = getDiff(user, data);
                if (Object.keys(changed).length === 0)
                    return;
                const profile : User = (await api.patch('/profile', data)).data;
                setUser(profile);
                setSuccess(true);
            }catch(errors: any){
                setSuccess(false);
                setError('root', {message: 'An unexpected error occurred, Please try again.'})
                console.log(errors.response);
            }
        }
    }

    return (
        <div className="flex flex-col justify-center w-full space-y-5 max-w-200">
            <h2 className="text-xl font-semibold">Profile</h2>
            <div className="w-full h-[0.5px] bg-border my-6"></div>
            <div className="flex justify-center">
                <div className="relative w-40 h-40">
                    <img src={user?.avatarUrl || ''} className="w-full h-full rounded-full shadow-2xl"/>
                    <IconButton size={"xlg"} icon={AiOutlineEdit} className="absolute -bottom-2 left-30 text-brand"></IconButton>
                </div>
            </div>
            <form className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <Input  label="First name"
                            defaultValue={user?.firstName ? user.firstName : ''}
                            {...register('firstName')}
                            error={errors.firstName?.message}
                    >
                    </Input>
                    <Input  label="Last name"
                            defaultValue={user?.lastName ? user?.lastName : ''}
                            {...register('lastName')}
                            error={errors.lastName?.message}
                    ></Input>
                </div>
                <Input  label="Phone number"
                        defaultValue={user?.phoneNumber ? user.phoneNumber : ''}
                        {...register('phoneNumber')}
                        error={errors.phoneNumber?.message}
                ></Input>
                <Input  label="Bio"
                        defaultValue={user?.bio ? user.bio : ''}
                        {...register('bio')}
                        error={errors.bio?.message}
                ></Input>
                <div className="grid grid-cols-2 gap-4">
                    <Select options={countries}
                         {...register('country')}
                         defaultValue={user?.country || ''}
                         label="Country"
                    ></Select>
                    <Input  label="City"
                            defaultValue={user?.city ? user.city : ''}
                            {...register('city')}
                            error={errors.city?.message}
                    ></Input>
                </div>
                <div className="-mt-4">

                <label className=" text-secondary text-xs ml-3 ">Currently, we only support countries shown here.</label>
                </div>
                <Input  label="Address"
                        defaultValue={user?.address ? user.address : ''}
                        {...register('address')}
                        error={errors.address?.message}
                ></Input>
                {errors.root && <span className="text-red-600 text-sm ml-3">{errors.root.message}</span>}
                {success && <span className="text-green-500 text-sm ml-3">Your changes have been saved.</span>}

                <Button className="mt-5 w-full" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                    {!isSubmitting   ? 'Save'
                                    : <CgSpinner className="text-4xl text-gray-300 animate-spin"> </CgSpinner>}
                </Button>

            </form>
        </div>
    )
}