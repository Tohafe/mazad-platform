import Home from "./pages/Home.tsx";
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import HeaderSection from "./sections/HeaderSection.tsx";
import Footer from "./components/Footer.tsx";
import CategoryAuctions from "./pages/CategoryAuctions.tsx";


const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
        errorElement: <span className="text-lg font-semibold p-6">404 NOT FOUND</span>
    },
    {
        path: '/c/:idSlug',
        element: <CategoryAuctions/>
    }
]);

const App = () => {
    return (
        <div className="flex bg-white flex-col px-12 w-full items-center min-h-screen gap-0 overflow-x-hidden">
            <HeaderSection className="w-full max-w-305"/>
            <RouterProvider router={router}/>
            <Footer className="w-full max-w-305"/>
        </div>
    )
};

export default App;
