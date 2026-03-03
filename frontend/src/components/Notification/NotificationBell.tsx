import { useNotifications } from '../../hooks/useNotifications';
import { useState, useRef, useEffect } from 'react';
import { formatTimeAgo } from '../../lib/utils';
import IconButton from "../Button/IconButton";
import { FiBell } from "react-icons/fi";
import type { RefObject } from 'react';



export function useOnClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void) {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) return;
            handler();
        };
        document.addEventListener("mousedown", listener);
        return () => document.removeEventListener("mousedown", listener);
    }, [ref, handler]);
}

export function NotificationBell() {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(menuRef, () => setIsOpen(false));

    const { 
        notifications, 
        unreadCount, 
        hasMore, 
        isLoading, 
        observerTarget, 
        markAllAsRead,
        handleNotificationClick
    } = useNotifications(isOpen);


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
                    
                    <div className="p-4 flex flex-col gap-2 max-h-80 overflow-y-auto bg-gray-50/30">
                        {notifications.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">No new notifications</p>
                        ) : (
                            notifications.map((notif) => (
                                <div 
                                    key={notif.id}
                                    onClick={() => {
                                        handleNotificationClick(notif);
                                        if (notif.targetUrl) 
                                            setIsOpen(false);
                                    }}
                                    className={`p-3 rounded border transition-colors cursor-pointer ${notif.read ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100'}`}
                                >
                                    <p className={`text-sm ${notif.read ? 'text-gray-500' : 'text-blue-900 font-medium'}`}>
                                        {notif.message}
                                    </p>
                                    <span className="text-xs text-gray-400 mt-1 block">
                                        {formatTimeAgo(notif.createdAt)}
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
                    {unreadCount > 0 && (
                        <div className="p-3 border-t border-gray-100 bg-white shrink-0">
                            <button 
                                onClick={markAllAsRead}
                                className="w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold rounded-md transition-colors text-sm text-center"
                            >
                                Mark all as read
                            </button>
                        </div>
                    )}
                </div>
            )}
            
        </div>
    );
}