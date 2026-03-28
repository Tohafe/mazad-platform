import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthProvider"
import Button from "../Button/Button";
import Input from "../Input/Input";
import { useForm } from "react-hook-form";
import z from 'zod'
import Select from "../Input/Select";
import type User from "../../types/user";
import { useRef, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { IoMdMore } from "react-icons/io";
import IconButton from "../Button/IconButton";
import type AvatarData from "../../types/AvatarData";
import { useFileUpload } from "../../hooks/useFileUpload";
import useUserApi from "../../hooks/useUserApi";
import Dropdown from "../Dropdown";
import Dropzone from "./DropZone";
import TextButton from "../Button/TextButton";
import { useOnClickOutside } from "../Notification/NotificationBell";
import ConfirmDialog from "../Dialog/ConfirmDialog";

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
            .max(200, "must be less than 200 characters"),
    country : z.enum(countries, 'Please select a supported country from the list'),
    city : z.string()
            .min(2, "must be at least 2 characters")
            .max(20, "must be less than 20 characters"),
    address : z.string()
        .min(10, "must be at least 10 characters")
        .max(200, "must be less than 200 characters"),
})

export type ProfileData = z.infer<typeof schema>;

export default function Profile(){
    const {user, setUser} = useAuth();
    const [success, setSuccess] = useState(false);
    const [more, setMore] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null)
    const {saveFile, deleteFile} = useFileUpload();
    const {editAvatar, addProfile, editProfile} = useUserApi();


    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        setError
    } = useForm<ProfileData>({
        resolver: zodResolver(schema),
        values: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phoneNumber: user?.phoneNumber || '',
            bio: user?.bio || '',
            country: (user?.country) || 'Morocco',
            city: user?.city || '',
            address: user?.address || ''
        }
    });
    const moreRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(moreRef, () => {setMore(false)});


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
            addProfile(data)
                .then((profile: User) => {
                    setUser(profile);
                    setSuccess(true);
                })
                .catch(() => {
                    setSuccess(false);
                    setError('root', {message: 'An unexpected error occurred, Please try later.'})
                })
        }
        else{
            const changed = getDiff(user, data);
            if (Object.keys(changed).length === 0)
                return;

            editProfile(data)
                .then((profile: User) => {
                    setUser(profile);
                    setSuccess(true);
                })
                .catch(() => {
                    setSuccess(false);
                    setError('root', {message: 'An unexpected error occurred, Please try again.'})
                })
        }
    }

    const uploadAvatar = async (files: File[]) => {
        setMore(false);
        try{
            const response = await saveFile(files[0], user?.avatarImageId, "400", "400");
            const avatarData: AvatarData ={
                avatarImageId: response.id,
                avatarUrl: response.url,
                avatarThumbnailUrl: response.thumbnailUrl
            }
            if (user?.avatarImageId == null)
                editAvatar(avatarData)
                    .then((user: User) => setUser(user));
            else{
                const updatedUser = {
                    ...user, 
                    avatarThumbnailUrl: avatarData.avatarThumbnailUrl,
                    avatarUrl: avatarData.avatarUrl
                };
                setUser(updatedUser);
            }
        setUploadError(null);
        }catch (err: any){
            setUploadError(err.response?.data?.message || 'An unexpected error occurred, Please try again.')
        }
    }
    
    const deleteAvatar = async () => {
        setShowConfirm(false)
        try{
            if (user?.avatarImageId != null){
                deleteFile(user.avatarImageId);
                editAvatar({avatarImageId: null, avatarUrl: null, avatarThumbnailUrl: null})
                .then((user: User) => setUser(user));
            }
        }catch (err: any){
            setUploadError('An unexpected error occurred, Please try again.')
        }
    }

    const uploadFails = (message: string) => {
        setMore(false);
        setUploadError(message);
    }


    return (
        <div className="flex flex-col justify-center w-full space-y-5 max-w-200">
            <h2 className="text-xl font-semibold">Profile</h2>
            <div className="w-full h-[0.5px] bg-border my-6"></div>
            <div className="flex justify-center">
                <div className="relative w-40 h-40">
                    <img src={user?.avatarUrl || undefined} className="w-full h-full rounded-full shadow-2xl"/>
                        <IconButton 
                            size={"xlg"}
                            icon={IoMdMore}
                            className="absolute -bottom-2 left-30 text-brand"
                            onClick={() => setMore(true)}
                        >
                        </IconButton>
                        <div ref={moreRef} className="absolute -right-22 bottom-1 w-22 ">
                            <Dropdown open={more}>
                                <Dropzone onFilesSelected={uploadAvatar} onError={uploadFails} maxSizeMB={8} >
                                    <TextButton className="hover:bg-gray-100 cursor-pointer w-full">Update</TextButton>
                                </Dropzone>
                                <div className="w-full h-[0.5px] bg-border "></div>
                                {user?.avatarImageId
                                    && <TextButton onClick={() => {setMore(!more); setShowConfirm(!showConfirm)}} className="hover:bg-gray-100 cursor-pointer w-full">Delete</TextButton>}
                            </Dropdown>
                        </div>
                        <ConfirmDialog 
                            open={showConfirm}
                            onConfirm={deleteAvatar}
                            onClose={() => {setShowConfirm(false)}}
                            dialogInfo={{
                                title: "Delete Profile Picture",
                                message: "Are you sure you want to delete your profile avatar?",
                                note: " "
                            }}
                        ></ConfirmDialog>
                </div>
            </div>
            { uploadError && <div className="text-error flex justify-center text-sm">{uploadError}</div>}
            <form className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <Input  label="First name"
                            {...register('firstName')}
                            error={errors.firstName?.message}
                    >
                    </Input>
                    <Input  label="Last name"
                            {...register('lastName')}
                            error={errors.lastName?.message}
                    ></Input>
                </div>
                <Input  label="Phone number"
                        {...register('phoneNumber')}
                        error={errors.phoneNumber?.message}
                ></Input>
                <Input  label="Bio"
                        {...register('bio')}
                        error={errors.bio?.message}
                ></Input>
                <div className="grid grid-cols-2 gap-4">
                    <Select options={countries}
                         {...register('country')}
                         label="Country"
                    ></Select>
                    <Input  label="City"
                            {...register('city')}
                            error={errors.city?.message}
                    ></Input>
                </div>
                <div className="-mt-4">

                <label className=" text-secondary text-xs ml-3 ">Currently, we only support countries shown here.</label>
                </div>
                <Input  label="Address"
                        {...register('address')}
                        error={errors.address?.message}
                ></Input>
                {errors.root && <span className="text-error text-sm ml-3">{errors.root.message}</span>}
                {success && <span className="text-green-500 text-sm ml-3">Your changes have been saved.</span>}

                <Button className="mt-5 w-full" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                    {!isSubmitting   ? 'Save'
                                    : <CgSpinner className="text-4xl text-gray-300 animate-spin"> </CgSpinner>}
                </Button>

            </form>
        </div>
    )
}