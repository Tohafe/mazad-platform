import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Home from "./pages/Home.tsx";
const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
        errorElement: <span className="text-lg font-semibold p-6">404 NOT FOUND</span>
    }
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>
)
