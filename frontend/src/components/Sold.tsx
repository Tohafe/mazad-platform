export  default function  Sold(){
    let sold = "42" // get the correct sold from api and/or socket @

    return (
        <div className={"border border-gray-300 p-1"}>
            <p className={'font-bold'}>Sold: <span className={'text-brand'}>{sold}</span> $</p>
        </div>
    );
}