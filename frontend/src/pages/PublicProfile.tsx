import { useParams, useNavigate } from "react-router-dom";
import useUserApi from '../hooks/useUserApi'
import type PublicProfile from "../types/PublicProfile";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useAuctions } from "../hooks/useAuctions";
import ItemGrid from "../components/Grid/ItemGrid";
import Pagination from "../components/Pagination";
import ConnectionButton from "../components/Button/ConnectionButton";
import IconButton from "../components/Button/IconButton.tsx";
import { PiChatDots } from "react-icons/pi";
import ListingCard from "../components/Card/ListingCard.tsx";



export default function PublicProfile(){
    const {username} = useParams();
    const {user} = useAuth();
    const {getPublicProfile} = useUserApi();
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [profileErrorMsg, setProfileErrorMsg] = useState<string>('loading');
    const [page, setPage] = useState(0);
    const {data} = useAuctions({page: page, size: 10, sellerId: profile?.userId})
    const [isFriend, setIsFriend] = useState(false);
    const navigate = useNavigate();

    if (!username)
        return (<div>NOT FOUND</div>)

    useEffect(() => {
        getPublicProfile(username)
            .then((prof) => setProfile(prof))
            .catch((err: AxiosError) => {
                if (err.status === 404)
                    setProfileErrorMsg('Not found');
                else{
                    setProfileErrorMsg("An unexpected error occurred, Please try later.");
                    console.log(err);
                }
                setProfile(null);
            });
    }, [username])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    return (<>
            {!profile && <p className="text-secondary text-xl">{profileErrorMsg}</p>}
            {profile && 
                <div className="w-full max-w-305 flex gap-2 flex-col space-y-5 p-4">
                    <div className="w-full max-w-120 p-2 space-y-3">
                        <div className="flex justify-center gap-10">
                            <img src={profile.avatarUrl} className="w-25 h-25 rounded-full shadow-2xl"/>
                            <div className="bordder flex flex-col justify-center">
                                <h1 className="font-bold text-xl">{profile.username}</h1>
                                <h2 className="text-secondary ">{profile.country || 'Morroco'}</h2>
                            </div>
                            {user && profile.userId != user.id &&
                                <div className={'flex mt-10 -ml-5 '}>
                                    <ConnectionButton user={user} other={profile} setIsFriend={setIsFriend}/>
                                    {isFriend && <IconButton icon={PiChatDots} className={"text-brand"} onClick={() => navigate(`/inbox/${profile.userId}`)}></IconButton>}
                                </div>}
                        </div>
                        {profile.bio && <p className="text-sm max-w-120"><span className="text-secondary">bio: </span> {profile.bio}</p> }
                    </div>
                <div className="w-full h-[0.5px] bg-border"></div>
                    <div className="w-full flex flex-col">
                        <h1 className="font-semibold text-xl">Objects from <span className="text-brand">{profile.username}</span></h1>
                        {data && data.content.length > 0 ? 
                        <>
                            <ItemGrid className="w-full h-full pt-4" compact={false}>
                                {data.content && data.content.map((item) => <ListingCard key={item.id} className="pt-2" auction={item}/>)}
                            </ItemGrid>
                            <Pagination page={data.page.number + 1} totalPages={data.page.totalPages} onPageChange={(pageNum) => setPage(pageNum - 1)} className="pt-10"/>
                        </> : <div className="text-secondary textd-xl  mt-8 w-full text-center"> This user currently has no active auctions.</div>}
            
                    </div>
                </div>
            }
        </>
    );
}