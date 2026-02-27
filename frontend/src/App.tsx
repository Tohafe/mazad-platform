import Home from "./pages/Home.tsx";
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import HeaderSection from "./sections/HeaderSection.tsx";
import Footer from "./components/Footer.tsx";
import CategoryAuctions from "./pages/CategoryAuctions.tsx";
import Register from "./components/Form/RegisterForm.tsx";
import Login from "./components/Form/LoginForm.tsx";
import PersistLogin from "./components/PersistLogin.tsx";
import RequireAuth from "./components/RequireAuth.tsx";
import Profile from "./pages/Profile.tsx";
import Inbox from "./pages/Inbox.tsx";

const router = createBrowserRouter([
    {
        element: <PersistLogin/>,
        children: [
            {
                path: '/',
                element: <Home/>,
                errorElement: <span className="text-lg font-semibold p-6">404 NOT FOUND</span>
            },
            {
                path: '/c/:idSlug',
                element: <CategoryAuctions/>
            },
            {
                element: <RequireAuth/>,
                children: [
                    {
                        path: '/profile',
                        element: <Profile/>
                    }
                ]
            }
        ]
    },
    {
        path:'/register',
        element: <Register/>
    },
    {
        path: '/login',
        element: <Login/>
    },
    {
        path:'/Inbox',
        element: <Inbox />
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
