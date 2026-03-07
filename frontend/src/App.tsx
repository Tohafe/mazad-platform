import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import {useAuctionsUpdates} from "./hooks/useAuctionsUpdates.ts";
import CategoryAuctions from "./pages/CategoryAuctions.tsx";
import Register from "./components/Form/RegisterForm.tsx";
import PersistLogin from "./components/PersistLogin.tsx";
import SearchAuctions from "./pages/SearchAuctions.tsx";
import RequireAuth from "./components/RequireAuth.tsx";
import CreateAuction from "./pages/CreateAuction.tsx";
import Login from "./components/Form/LoginForm.tsx";
import Settings from "./pages/Settings.tsx";
import Inbox from "./pages/Inbox.tsx";
import ItemPage from "./pages/ItemPage.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import AppLayout from "./AppLayout.tsx";
import Home from "./pages/Home.tsx";


export const router = createBrowserRouter([
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
                        path:'/Inbox',
                        element: <Inbox />
                    },
                    {
                        path: '/itemDetails/:productId',
                        element: <ItemPage />
                    },
                    {
                        element: <RequireAuth/>,
                        children: [
                            {
                                path: '/dashboard',
                                element: <Dashboard/>,
                            },
                            {
                                path: '/settings',
                                element: <Settings/>,
                            },
                            {
                                path: '/create',
                                element: <CreateAuction/>
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
    useAuctionsUpdates();
    return (
        <RouterProvider router={router}/>
    )
};

export default App;
