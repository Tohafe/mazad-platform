import IconButton from "./Button/IconButton.tsx";
import {FcGoogle} from "react-icons/fc";
import {Si42} from "react-icons/si";
import Cookies from "js-cookie";
import {useLocation} from "react-router-dom";

const MAZAD_IP = import.meta.env.VITE_MAZAD_IP;
export  default function OAuth(){
    const from = useLocation().state?.from;

    const handleOAuthLogin = (provider: '42' | 'google') => {
        const currentPath = from?.pathname ? from?.pathname === '/login' ? '/settings' : from?.pathname : '/settings';
        Cookies.set('from', currentPath, {
            expires: 1/1440,
            path: '/',
            sameSite: 'lax',
            secure: true
        });

        window.location.href = `https://${MAZAD_IP}/oauth2/authorization/${provider}`;
    };

    return <>
        <div className={"w-full flex gap-2"}>
            <div className="w-full h-[0.5px] bg-border my-6"></div>
            <p className={"my-4 text-secondary text-xs"}>or</p>
            <div className="w-full h-[0.5px] bg-border my-6"></div>
        </div>
        <div className={'space-y-2'}>
            <IconButton className={"w-full border border-gray-500 h-13 relative"} iconClassName={"h-full w-9 absolute left-5"} icon={FcGoogle} onClick={() => handleOAuthLogin('google') }>     Continue with Google </IconButton>
            <IconButton className={"w-full border border-gray-500 h-13 relative"} iconClassName={"h-full w-9 absolute left-5"} icon={Si42} onClick={() => handleOAuthLogin('42') }>     Continue with 42 </IconButton>
        </div>
    </>
}