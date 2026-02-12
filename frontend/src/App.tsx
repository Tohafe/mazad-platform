import Home from "./pages/Home.tsx";
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
        errorElement: <span className="text-lg font-semibold p-6">404 NOT FOUND</span>
    }
]);

const App = () => {
    return (
        <div>
            <RouterProvider router={router}/>
        </div>
    )
};

export default App;
