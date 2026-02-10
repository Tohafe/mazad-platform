
interface AuctionCardProps {
    title: string;
    currentBid: number;
    timeLeft: string;
    imageSrc: string
}

const AuctionCard = (props: AuctionCardProps) => {

    const handleCLick = () => {
        confirm("Hello?")
    }
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl" onClick={handleCLick}>
            <img className="rounded-xl " src={props.imageSrc} alt="Not found"/>
            <h2 className="pt-3 font-semibold ">{props.title}</h2>
            <div className="flex flex-row justify-between mt-2">
                <div className="flex flex-col">
                    <p className=" text-sm font-semibold text-gray-400">Current Bid</p>
                    <p className="text-sm font-bold text-green-600">$ {props.currentBid}</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-400">Ends in:</p>
                    <p className="text-sm font-semibold text-black">{props.timeLeft}</p>
                </div>

            </div>
        </div>
    )
}

export default AuctionCard