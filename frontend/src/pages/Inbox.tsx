import { useState } from "react";




function Inbox(){

    const [activeChatId, setActiveChatId] = useState<number | null>(null);

    const fakeChats = [
        {id: 1, name: "Hamza", lastMessage: "Whats the last price ?"},
        {id: 2, name: "Ahmed", lastMessage: "Is this item still on Mazad ?"}

    ];
    

    return (
        // PAGE WRAPPER 
        <div className="flex justify-center items-start pt-6 h-[calc(100vh-180px)] w-full bg-gray-50 font-sans px-4">
            {/* MAIN INBOX CONTAINER */}
            <div className="flex w-full max-w-7xl h-[calc(100vh-220px)] min-h-150 bg-white border border-gray-300 rounded-lg shadow-sm overflow-y-hidden">
                {/* Left panel */}
                <div className="w-100 flex flex-col border-r border-gray-300">
                    {/* header area for the left panel */}
                    <div className=" p-6 border-b border-gray-300">
                        <h2 className="text-2xl font-bold">Messages</h2>
                    </div>
                    
                    {/* CONVERSTAION LIST */}
                    <div className="flex flex-1 overflow-y-auto">
                        <p className="p-6 text-center text-sm text-gray-500">
                            (ConversationList components would here)
                        </p>
                    </div>

                </div>
                {/* Right Panel */}
                <div className="flex-1 flex flex-col bg-white">
                    {(activeChatId) ? (
                            <div className="flex flex-1 items-center justify-center text-xl font-semibold text-gray-700">
                                Chatting with ID: {activeChatId}
                            </div>

                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4">
                                <div className="w-24 h-24 rounded-full mb-2  bg-blue-50 flex items-center justify-center text-blue-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Start a conversation</h3>
                                <p className="text-sm">Select a chat on the left to see your messages here.</p>
                            </div>

                        )}

                </div>

            </div>
        </div>
    );
}


export default Inbox;

