import Home from "./pages/Home.tsx";
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import HeaderSection from "./sections/HeaderSection.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
        errorElement: <span className="text-lg font-semibold p-6">404 NOT FOUND</span>
    }
]);

const App = () => {
    return (
        <div className="flex bg-white flex-col px-12 w-screen h-screen items-center gap-0 overflow-x-hidden">
            <HeaderSection className="w-full max-w-305"/>
            <RouterProvider router={router}/>
        </div>
    )
};

export default App;
