import { notificationApi } from "../services/notificationApi";
import { useWebSocket } from "../context/WebSocketContext";
import type { Notification } from "../types/notification";
import { useEffect, useRef, useState } from "react";

export function useNotifications(isOpen: boolean) {

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const observerTarget = useRef<HTMLDivElement>(null);

    const { stompClient, isConnected } = useWebSocket();

    const unreadCount = notifications.filter(n => !n.read).length;


    useEffect(() => {
        if (isLoading || !hasMore) return;

        const fetchNotifications = async () => {
            setIsLoading(true);
            try {
                const data = await notificationApi.getPage(page);
                
                if (data && data.content) {
                    setHasMore(!data.last);
                    setNotifications(prev => page === 0 ? data.content : [...prev, ...data.content]);
                } else if (Array.isArray(data)) {
                    setHasMore(false);
                    setNotifications(prev => page === 0 ? data : [...prev, ...data]);
                }
            } catch (error) {
                console.error("Network Error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, [page]); 
  
    useEffect(() => {
        if (!isOpen) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading && hasMore) {
                    setPage(prevPage => prevPage + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) observer.observe(observerTarget.current);

        return () => {
            if (observerTarget.current) observer.unobserve(observerTarget.current);
        };
    }, [isOpen, isLoading, hasMore]); 

 
    const markAsRead = async (id: string, isAlreadyRead: boolean) => {
        if (isAlreadyRead) return;

        
        setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, read: true } : notif));

        try {
            await notificationApi.markAsRead(id);
        } catch (error) {
            console.error("Failed to sync:", error);
            setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, read: false } : notif));
        }
    };

    useEffect(() => {
        if (!stompClient || !isConnected) return;

 

        
        const subscription = stompClient.subscribe('/user/queue/notification', (message) => {

            const newNotification: Notification = JSON.parse(message.body);

            console.log(message);
            setNotifications((prevArray) => [newNotification, ...prevArray]);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [stompClient, isConnected]);


    return { 
        notifications, 
        unreadCount, 
        hasMore, 
        isLoading, 
        observerTarget, 
        markAsRead 
    };
}