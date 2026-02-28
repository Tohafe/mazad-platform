


function ChatWindow({ chatId } : {chatId:number}){

    const fakeMessages = [
        { id: 1, text: "Hey! Is the auction got postponedHey! Is the auction got postponedHey! Is the auction got postponedHey! Is the auction got postponed ?", sender: "them"},
        { id: 2, text: "Yes it is postponed, are you interested ? ", sender: "me"},
        { id: 2, text: "Yes it is postponed, are you interested ? ", sender: "them"},
        { id: 2, text: "Yes it is postponed, are you interested ? ", sender: "them"},
        { id: 2, text: "Yes it is postponed, are you interested ? ", sender: "them"},
        { id: 2, text: "Yes it is postponed, are you interested ?", sender: "me"},
        { id: 2, text: "Yes it is postponed, are you interested ? ", sender: "me"},
        { id: 2, text: "Yes it is postponed, are you interested ? ", sender: "me"},
        { id: 2, text: "Yes it is postponed, are you interested ? ", sender: "them"},
        { id: 2, text: "Yes it is postponed, are you interested ? ", sender: "them"},
        { id: 2, text: "Yes it is postponed, are you interested ? ", sender: "them"},
        { id: 2, text: "Yes it is postponed, are you interested ? ", sender: "them"},
        { id: 5, text: "Yes it is postponed, are you interested ? ", sender: "them"},
        { id: 3, text: "Yes i'm waiting for the new auction date ? ", sender: "them"},
        { id: 10, text: "Yes i'm waiting for the new auction date ? ", sender: "me"}
    ];
    
    return (
        <div className="flex flex-col w-full h-full bg-white">
            {/* // HEADER */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
                {/* AVATAR */}
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-full font-bold text-blue-600">
                    ?
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">User {chatId}</h3>
                    <p className="text-xs text-green-500"> Online{/*  || Offline TODO: get status somehow*/}</p>
                </div>
            </div>

            {/* // MESSAGE FEED  */}
            <div className="flex-1 overflow-auto p-4 flex flex-col gap-4 bg-gray-50">
                {fakeMessages.map((msg) => (
                    <div 
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] px-4 py-2 rounded-2xl
                            ${
                                msg.sender === 'me'
                                    ? 'bg-blue-600 text-white rounded-br-none ' 
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                            }`
                            }
                        >
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                )
                )}
            </div>
            {/* INPUT AREA */}
            <div className="p-4 bg-white border-t border-gray-200 shrink-0">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Type amessage..."
                        className="flex-1 px-4 py-2 bg-gray-100 border-transparent rounded-full  focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform"
                    />
                    <button className="bg-blue-500 rounded-full px-4 py-2 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                        Send
                    </button>
                    {/* <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center">
                        Send
                    </button> */}

                </div>
            </div>
        </div>
    )

}

export default ChatWindow;


