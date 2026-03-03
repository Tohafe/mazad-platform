import {Outlet} from "react-router-dom";
import HeaderSection from "./sections/HeaderSection.tsx";
import Footer from "./components/Footer.tsx";

const AppLayout = () => {
    return (
        <div className="flex bg-white flex-col px-2 w-full items-center min-h-screen gap-0 overflow-x-hidden">
            <HeaderSection className="w-full max-w-305"/>
            <Outlet />
            <Footer className="w-full max-w-305"/>
        </div>
    );
};

export default AppLayout;