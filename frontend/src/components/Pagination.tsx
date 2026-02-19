import {cn} from "../lib/utils.ts";
import Button from "./Button/Button.tsx";
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from "react-icons/md";
import {useState, useMemo} from "react";

interface PaginationProps {
    page: number
    totalPages: number
    onPageChange: (n: number) => void
    className?: string
}


const Pagination = ({page, totalPages, onPageChange, className = ""}: PaginationProps) => {
    const [selectedPage, setSelectedPage] = useState(page);
    console.log(page)

    const pageNumbers: (string | number)[] = useMemo(() => getPagesNums(totalPages, selectedPage), [selectedPage]);

    const handlePageChange = (page: number) => {
        setSelectedPage(page);
        onPageChange(page);
    }

    const moveTo = (direction: 'next' | 'previous') => {
        if (direction === "next")
            handlePageChange(selectedPage < totalPages ? selectedPage + 1 : selectedPage)
        else
            handlePageChange(selectedPage === 1 ? selectedPage : selectedPage - 1);
    }


    return <div className={cn("flex flex-col gap-8 items-center", className)}>
        <div className="flex gap-4">
            {selectedPage > 1 && <Button className="w-50" icon={MdKeyboardArrowLeft}
                                         onClick={() => moveTo("previous")}>Previous</Button>}
            {totalPages > selectedPage && <Button className="w-50" icon={MdKeyboardArrowRight} iconPos="right"
                                                  onClick={() => moveTo("next")}>Next</Button>}
        </div>
        <div className="flex flex-row gap-8">
            {pageNumbers.map((num) => {
                if (typeof num === 'string') return <span className="text-muted">{num}</span>;
                return <PageNumber isSelected={num === selectedPage} page={num} onClick={() => handlePageChange(num)}/>
            })}
        </div>
    </div>
}


const PageNumber = ({page, isSelected, onClick}: {
    page: number | string,
    isSelected: boolean,
    onClick?: () => void
}) => {
    return <a onClick={onClick}
              className={`${isSelected ? "text-black font-semibold" : "text-muted"} cursor-pointer`}>{page}</a>

}

function getPagesNums(totalPages: number, selectedPage: number) {
    const maxGap = 3
    if (totalPages <= 10)
        return Array.from({length: totalPages}, (_, i) => i + 1);
    const pages: (number | string)[] = [1]; // 1, 2, 3
    if (selectedPage - 1 <= maxGap) {
        for (let i: number = 2; i <= selectedPage; i++)
            pages.push(i);
    } else {
        pages.push("...");
        if (selectedPage === totalPages)
            pages.push(selectedPage - 2);
        pages.push(selectedPage - 1)
        pages.push(selectedPage);
    }

    if (totalPages - selectedPage > maxGap) {
        pages.push(selectedPage + 1);
        if (selectedPage === 1) pages.push(selectedPage + 2)
        pages.push("...");
        pages.push(totalPages);
    } else {
        for (let i = selectedPage + 1; i <= totalPages; i++)
            pages.push(i);
    }
    return pages;
}

export default Pagination