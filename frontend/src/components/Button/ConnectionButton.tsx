import { useEffect, useState } from "react";
import useUserApi from "../../hooks/useUserApi";
import type PublicProfile from "../../types/PublicProfile";
import type User from "../../types/user";
import Button from "./Button";
import type { ConnectionStatus } from "../../types/connectionStatus";


 export default function ConnectionButton({user, other}:{user: User, other: PublicProfile}){
    const {sendFriendRequest, isFriend} = useUserApi();
    const [buttonText, setButtonText] = useState('Connect');
    const [variant, setVariant] = useState<'primary' | 'danger' | 'secondary' | null>('primary')
    const [status, setStatus] = useState<ConnectionStatus>('DELETED');

    const onClick = () => {
        sendFriendRequest(other.username)
        .then((res) => {
            setStatus(res);
        })
        .catch(() => {
        })
    }
    useEffect(() => {
        isFriend(other.userId)
        .then((res) => {
            let text ;
                if (res.status === 'PENDDING'){
                    if (res.requesterId === user.id){
                        text = 'Cancel'
                        setVariant("danger")
                    }
                    else{
                        text = 'Accept'
                        setVariant('secondary')
                    }
                }
                else if (res.status === 'ACCEPTED'){
                    text = 'Disconnect';
                    setVariant("secondary");
                }
                else{
                    text = 'Connect';
                    setVariant('primary');
                }
                setStatus(res.status);
                setButtonText(text);
            })
            .catch(() => {
                setButtonText('Connect')
                setVariant('primary');
            })
    }, [status, other]);

    return <>
        <Button size={'sm'} className='mt-10 -ml-5' variant={variant} onClick={onClick}>{buttonText}</Button>
        </>
 }