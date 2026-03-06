import Home from "./pages/Home.tsx";
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import CategoryAuctions from "./pages/CategoryAuctions.tsx";
import Register from "./components/Form/RegisterForm.tsx";
import Login from "./components/Form/LoginForm.tsx";
import PersistLogin from "./components/PersistLogin.tsx";
import RequireAuth from "./components/RequireAuth.tsx";
import {useAuctionsUpdates} from "./hooks/useAuctionsUpdates.ts";
import SearchAuctions from "./pages/SearchAuctions.tsx";
import AppLayout from "./AppLayout.tsx";
import Settings from "./pages/Settings.tsx";
import Inbox from "./pages/Inbox.tsx";
import ItemPage from "./pages/ItemPage.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfService from "./pages/TermsOfService.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import PublicProfile from "./pages/PublicProfile.tsx";


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
                        path:'/conversations',
                        element: <Inbox />
                    },
                    {
                        path: '/itemDetails/:productId',
                        element: <ItemPage />
                    },
                    {
                        path: '/privacy-policy',
                        element: <PrivacyPolicy/>
                    },
                    {
                        path: '/terms-of-service',
                        element: <TermsOfService/>
                    },
                    {
                        path: '/profile/:username',
                        element: <PublicProfile/>
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
                            }
                        ]
                    },
                    {
                        path: '*',
                        element: <NotFoundPage/>
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
