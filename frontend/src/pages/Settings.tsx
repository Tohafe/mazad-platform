
import { useAuth } from "../context/AuthProvider";
import Profile from "../components/Form/Profile";
import Security from "../components/Form/Security";

export default function Settings(){
    const {user} = useAuth();
    
    return (
        <div className="w-full max-w-305">
            <div className="h-full">
                <h1 className="text-4xl md:text-5xl xl:text-6xl font-serif font-semibold"> Hello {user?.username} </h1>
            </div>
            <div className="w-full h-[0.5px] bg-border my-10"></div>
            <div className="flex flex-col gap-10 xl:flex-row xl:gap-10">
                <Profile/>
                <Security/>
            </div>
        </div>
    )
}