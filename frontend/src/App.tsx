import Home from "./pages/Home.tsx";
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import CategoryAuctions from "./pages/CategoryAuctions.tsx";
import Register from "./components/Form/RegisterForm.tsx";
import Login from "./components/Form/LoginForm.tsx";
import PersistLogin from "./components/PersistLogin.tsx";
import RequireAuth from "./components/RequireAuth.tsx";
import Profile from "./pages/Profile.tsx";
import {useAuctionsUpdates} from "./hooks/useAuctionsUpdates.ts";
import SearchAuctions from "./pages/SearchAuctions.tsx";
import AppLayout from "./AppLayout.tsx";


const router = createBrowserRouter([
    {
        element: <AppLayout/>,
        children: [
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
                        path: '/search',
                        element: <SearchAuctions/>
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
    }
]);

const App = () => {
    useAuctionsUpdates();
    return (
        <RouterProvider router={router}/>
    )
};

export default App;
