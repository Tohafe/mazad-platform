import {cn} from "../../lib/utils.ts";
import Button from "../Button/Button.tsx";
import TextButton from "../Button/TextButton.tsx";
import {useEffect, useRef} from "react";

type DialogInfo = {
    title: string;
    message: string;
    note?: string;
}

interface DialogProps {
    className?: string;
    open: boolean;
    onConfirm?: () => void;
    onClose: () => void;
    dialogInfo: DialogInfo;
}

const ConfirmDialog = ({className = "", open, onConfirm, onClose, dialogInfo}: DialogProps) => {
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        if (!ref) return;
        if (open) ref.current?.showModal();
        else ref.current?.close();
    }, [open]);

    if (!open) return null;

    return <dialog
        ref={ref}
        className={cn("flex flex-col gap-5 items-center w-100 bg-white m-auto backdrop:bg-black/50 px-8 py-4", className)}
        onCancel={(e) => {
            e.preventDefault();
            onClose();
        }}
    >
        <h1 className="text-xl text-primary font-bold">{dialogInfo.title}</h1>
        <p className="text-base pt-4 text-center w-full text-primary font-bold line-clamp-2">{dialogInfo.message}</p>
        {dialogInfo.note &&
            <p className="text-xs pt-5 text-secondary font-medium line-clamp-3">{dialogInfo.note} By confirming you
                agree to our <a className="underline text-brand" href={"/terms-of-use"}>Terms of Use</a></p>}
        <Button className="w-full"
                onClick={() => {
                    onConfirm?.();
                    onClose();
                }}>Confirm</Button>
        <TextButton className="w-full" onClick={onClose}>Close</TextButton>
    </dialog>;
}


export default ConfirmDialog;