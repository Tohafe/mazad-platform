import Button from "./Button/Button.tsx";
import {cn} from "../lib/utils.ts";
import {BiCopy} from "react-icons/bi";
import {useGenApiKey, useGetApiKey} from "../hooks/useApiKey.ts";
import toast, {Toaster} from "react-hot-toast";
import {useEffect, useState} from "react";
import {CgSpinner} from "react-icons/cg";
import {useQueryClient} from "@tanstack/react-query";
import {useAuth} from "../context/AuthProvider.tsx";


interface Props {
    className?: string;
}

const ApiKeyGen = ({className = "",}: Props) => {
    const {user} = useAuth();
    const [key, setKey] = useState<string>();
    const {data: apiKey, isLoading} = useGetApiKey()
    const genApikey = useGenApiKey()
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!apiKey) return;
        const hiddenKey = apiKey?.slice(0, 5) + "**************************";
        setKey(hiddenKey);

    }, [apiKey]);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(apiKey ?? "");
            toast.success("Copied!");
        } catch (err) {
            toast.error("Failed to copy!");
            console.error("Failed to copy!", err);
        }
    };

    const handleGenerate = async () => {
        genApikey.mutate(undefined, {
            onSuccess: (newApiKey) => {
                toast.success("Key generated successfully.");
                const hiddenKey = newApiKey?.slice(0, 5) + "**************************";
                setKey(hiddenKey);

                queryClient.setQueryData(["apiKey", user?.id], newApiKey);
            },
            onError: () => {
                toast.error("Failed to generate key!");
            }
        })
    }

    if (isLoading) return <CgSpinner className="text-4xl text-gray-300 animate-spin"/>
    return <>
        <Toaster position={"bottom-right"}/>
        <div className={cn("flex flex-row gap-1", className)}>
            {apiKey && <div className="flex w-fit gap-4 items-center justify-between bg-muted px-4 py-3">
                <span className="w-full">{key}</span>
                <BiCopy onClick={handleCopy} size={24} className="cursor-pointer hover:bg-muted"/>
            </div>}
            {!apiKey &&
                <Button disabled={genApikey.isPending} type={"submit"} onClick={handleGenerate} size={"sm"} variant={"secondary"}>{
                    genApikey.isPending ? <CgSpinner className="text-xl text-gray-300 animate-spin"/> :
                        "Generate key"
                }</Button>}
        </div>
    </>
}

export default ApiKeyGen;