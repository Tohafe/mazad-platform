import { useState, type InputHTMLAttributes } from "react";
import IconButton from "../Button/IconButton";
import { MdErrorOutline } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { VscEyeClosed, VscEye} from "react-icons/vsc";


interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    label?: string;
    error?: string;
    isPass?: boolean;
}

export default function Input({label, error, isPass,  ...props}: InputProps){
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }
    return(
        <div className= "relative">
            <input placeholder= " " 
                className={`peer bg-muted w-full
                    h-14 px-4 pt-2 text-sm
                    outline-none 
                    ${error && "border border-red-500 pr-12"}`}  
                {...props}
                type={isPass ? showPassword ? 'text' : 'password' : 'text'}
            />
            {label && (<label
                className={`absolute  text-secondary left-4 top-4 text-sm duration-200 origin-left pointer-events-none
                    -translate-y-3 scale-80
                    peer-focus:-translate-y-3
                    peer-focus:scale-80
                    peer-placeholder-shown:scale-100
                    peer-placeholder-shown:translate-y-0
                `}
                >{label}</label>)}
            {error && !isPass && 
                <>
                    <span className={` text-red-600  text-[12px] ml-3`}> {error} </span> 
                    <IconButton icon={MdErrorOutline} className="absolute top-3 right-1 pointer-events-none" iconClassName="text-red-500 "> </IconButton>
                </>
            }
            {isPass && 
               ( showPassword
                ? <IconButton icon={VscEye} onClick={togglePasswordVisibility} className="absolute top-3 right-1 text-gray-600" ></IconButton>
                : <IconButton icon={VscEyeClosed} onClick={togglePasswordVisibility} className="absolute top-3 right-1 text-gray-600" ></IconButton>)
            }
        </div>
    )
}


