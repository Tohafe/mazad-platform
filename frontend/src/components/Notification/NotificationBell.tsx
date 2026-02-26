import { useState, useRef, useEffect } from 'react';
import type { RefObject } from 'react';
import axios from 'axios';
import IconButton from "../Button/IconButton";
import { FiBell } from "react-icons/fi";
import type { Notification } from '../../types/notification';


function useOnClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void) {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) return;
            handler();
        };
        document.addEventListener("mousedown", listener);
        return () => document.removeEventListener("mousedown", listener);
    }, [ref, handler]);
}


// When you move to multiple files, this goes to `src/services/notificationApi.ts`
const notificationApi = {
    getPage: async (pageNumber: number) => {

        await new Promise<void>((resolve) => {
            window.setTimeout(() => resolve(), 2000); // adjust ms as needed
        })

        const response = await axios.get(`http://localhost:8082/api/notifications?pageNumber=${pageNumber}&pageSize=4`, {
            headers: { "X-User-Id": "01" }
        });
        return response.data;
    },
    
    markAsRead: async (id: string) => {
        await axios.put(`http://localhost:8082/api/notifications/${id}/read`, {}, {
            headers: { "X-User-Id": "01" }
        });
    }
};


// When you move to multiple files, this goes to `src/hooks/useNotifications.ts`
function useNotifications(isOpen: boolean) {
    // A. Memory Allocations
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const observerTarget = useRef<HTMLDivElement>(null);

    // B. Derived Math
    const unreadCount = notifications.filter(n => !n.read).length;

    // C. The Network Bootloader & Pagination
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
    }, [page]); // Re-run when page changes

    // D. The Infinite Scroll Sensor
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
    }, [isOpen, isLoading, hasMore]); // Notice it uses the isOpen boolean passed into the hook!

    // E. The Mutation Controller
    const markAsRead = async (id: string, isAlreadyRead: boolean) => {
        if (isAlreadyRead) return;

        // Optimistic UI Update
        setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, read: true } : notif));

        try {
            await notificationApi.markAsRead(id);
        } catch (error) {
            console.error("Failed to sync:", error);
            // Rollback
            setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, read: false } : notif));
        }
    };

    // F. The Public Interface of the Hook
    return { 
        notifications, 
        unreadCount, 
        hasMore, 
        isLoading, 
        observerTarget, 
        markAsRead 
    };
}


export function NotificationBell() {
    // 1. UI Memory (Only things related to the screen)
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // 2. Hardware Interrupt
    useOnClickOutside(menuRef, () => setIsOpen(false));

    // 3. Connect to the Data Layer (The custom hook)
    const { 
        notifications, 
        unreadCount, 
        hasMore, 
        isLoading, 
        observerTarget, 
        markAsRead 
    } = useNotifications(isOpen);

    // 4. Render HTML
    return (
        <div className="relative inline-block" ref={menuRef}>
            <IconButton 
                icon={FiBell} 
                iconClassName="text-brand"
                onClick={() => setIsOpen(!isOpen)} 
            />

            {unreadCount > 0 && (
                <span className="absolute top-0 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white z-10 pointer-events-none">
                    {unreadCount}
                </span>
            )}

            {isOpen && (
                <div className="absolute right-0 mt-2 w-92 bg-white border border-gray-200 shadow-xl rounded-lg z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-white">
                        <div className="flex items-center justify-center">
                            <h3 className="font-bold text-gray-700">Notifications</h3>
                        </div>
                    </div>
                    
                    <div className="p-4 flex flex-col gap-2 max-h-96 overflow-y-auto bg-gray-50/30">
                        {notifications.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">No new notifications</p>
                        ) : (
                            notifications.map((notif) => (
                                <div 
                                    key={notif.id}
                                    onClick={() => markAsRead(notif.id, notif.read)}
                                    className={`p-3 rounded border transition-colors cursor-pointer ${notif.read ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100'}`}
                                >
                                    <p className={`text-sm ${notif.read ? 'text-gray-500' : 'text-blue-900 font-medium'}`}>
                                        {notif.message}
                                    </p>
                                    <span className="text-xs text-gray-400 mt-1 block">
                                        {notif.createdAt}
                                    </span>
                                </div>
                            ))
                        )}
                        
                        {hasMore && (
                            <div ref={observerTarget} className="h-4 w-full mt-2">
                                {isLoading && <p className="text-center text-xs text-gray-400">Loading...</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}