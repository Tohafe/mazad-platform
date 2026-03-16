import { useEffect, useState } from "react";
import useUserApi from "../../hooks/useUserApi";
import type PublicProfile from "../../types/PublicProfile";
import type User from "../../types/user";
import Button from "./Button";
import type { ConnectionStatus } from "../../types/connectionStatus";
import { useWebSocket } from "../../context/WebSocketContext.tsx";
import type FriendRequestEvent from "../../types/FriendRequestEvent.ts";


 export default function ConnectionButton({user, other}:{user: User, other: PublicProfile}){
    const {sendFriendRequest, isFriend} = useUserApi();
    const [buttonText, setButtonText] = useState('Connect');
    const [variant, setVariant] = useState<'primary' | 'danger' | 'secondary' | null>('primary')
    const [status, setStatus] = useState<ConnectionStatus>('DELETED');
    const { stompClient, isConnected } = useWebSocket();

    const onClick = () => {
        sendFriendRequest(other.username)
        .then((res) => {
            setStatus(res);
        })
        .catch(() => {
        })
    }


     useEffect(() => {
         if (!stompClient || !isConnected)
            return;
         const subscription = stompClient.subscribe(`/user/queue/profile/${other.username}`, (message) => {
            const friendEvent: FriendRequestEvent = JSON.parse(message.body);
            setStatus(friendEvent.status);
         });
         return () => {
            if (stompClient && stompClient.connected && subscription) {
                subscription.unsubscribe();
            }
        };
     }, [stompClient, isConnected]);

    useEffect(() => {
        isFriend(other.userId)
        .then((res) => {
            let text ;
            let variant: "primary" | "danger" | "secondary" | null;
            if (res.requesterId !== null){
                if (res.status === 'PENDDING'){
                    if (res.requesterId === user.id){
                        text = 'Cancel'
                        variant = 'danger';
                    }
                    else{
                        text = 'Accept'
                        variant = 'secondary';
                    }
                }
                else if (res.status === 'ACCEPTED'){
                    text = 'Disconnect';
                    variant = 'secondary';
                }
                else{
                    text = 'Connect';
                    variant = 'primary';
                }
            }
            else{
                text = 'Connect';
                variant = 'primary';
            }
            setStatus(res.status);
            setButtonText(text);
            setVariant(variant);
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