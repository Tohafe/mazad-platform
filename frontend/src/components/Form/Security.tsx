import { useState } from "react";
import TextButton from "../Button/TextButton";
import { useAuth } from "../../context/AuthProvider";
import ResetEmailForm from "./ResetEmailForm";
import ResetPasswordForm from "./ResetPasswordForm";

export default function Security(){
    const {user} = useAuth();

    const [showEmailEdit, setShowEmailEdit] = useState(false);
    const [showPassEdit, setShowPassEdit] = useState(false);


    const emailOnClick = () => {
        setShowEmailEdit(!showEmailEdit);
    }

    return(
        <div className="relative flex flex-col w-full h-full">
            <h2 className="text-xl font-semibold">Security</h2>
            <div className="w-full h-[0.5px] bg-border my-6"></div>
            <div className="flex flex-col gap-0">
                <label className="text-secondary text-sm">Username</label>
                <h2 className="font-semibold text-xl">{user?.username}</h2>
                <label className="text-secondary text-sm ">You can't edit your username.</label>
            </div>
            <div className="w-full h-[0.5px] bg-border my-6"></div>
            <div className="flex flex-col gap-0">
                <label className="text-secondary text-sm">Email Address</label>
                <h2 className="font-semibold text-xl">{user?.email}</h2>
                <TextButton className="text-brand w-15" onClick={emailOnClick}>Change</TextButton>
                {showEmailEdit && 
                    <div className="absolute z-20 space-y-4 w-full max-w-100 bg-white p-6 shadow-2xl border border-gray-100">
                        <ResetEmailForm setShowEmailEdit={setShowEmailEdit}></ResetEmailForm>
                    </div>
                }
            </div>
            <div className="w-full h-[0.5px] bg-border my-6"></div>
            <div className="flex flex-col gap-0">
                <label className="text-secondary text-sm">Password</label>
                <h2 >***********</h2>
                <TextButton className="text-brand w-15 " onClick={() => {setShowPassEdit(!showPassEdit)}}>Change</TextButton>
                {showPassEdit && 
                    <div className="absolute z-20 space-y-4 w-full max-w-100 bg-white p-6 shadow-2xl border border-gray-100">
                        <ResetPasswordForm setShowPassEdit={setShowPassEdit}></ResetPasswordForm>
                    </div>
                }
            </div>
            <div className="w-full h-[0.5px] bg-border my-6"></div>
        </div>
    )
}