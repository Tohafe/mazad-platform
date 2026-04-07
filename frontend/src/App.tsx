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
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfService from "./pages/TermsOfService.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import PublicProfile from "./pages/PublicProfile.tsx";
import UsersList from "./pages/UsersList.tsx";
import AppLayout from "./AppLayout.tsx";
import Home from "./pages/Home.tsx";
import AboutPage from "./pages/footer/About.tsx";
import HowItWorksPage from "./pages/footer/HowItWorks.tsx";
import TechnologiesPage from "./pages/footer/Technologies.tsx";
import HelpCenter from "./pages/footer/HelpCenter.tsx";
import BiddingGuide from "./pages/footer/BiddingGuide.tsx";


export const router = createBrowserRouter(
    [
        {
            element: <PersistLogin/>,
            children: [
                {
                    element: <AppLayout/>,
                    children:
                        [
                            {
                                element: <RequireAuth/>,
                                children:
                                    [
                                        {
                                            path: '/dashboard',
                                            element: <Dashboard/>,
                                        },
                                        {
                                            path: '/settings',
                                            element: <Settings/>,
                                        },
                                        {
                                            path: '/listing',
                                            element: <CreateAuction/>
                                        },
                                        {
                                            path:'/inbox/:userId?',
                                            element: <Inbox/>
                                        }
                                    ]
                            },
                            {
                                path: '/register',
                                element: <Register/>
                            },
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
                                path: '/auction/:productId',
                                element: <ItemPage/>
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
                                path: '/users',
                                element: <UsersList/>
                            },
                            {
      
                                path: '/about',
                                element: <AboutPage/>
                            },
                            {
                                path: '/how-it-works',
                                element: <HowItWorksPage/>
                            },
                            {
                                path: '/technologies',
                                element: <TechnologiesPage/>
                            },
                            {
                                path: '/help',
                                element: <HelpCenter/>
                            },
                            {
                                path: '/guide',
                                element: <BiddingGuide/>
                            },
                            {
                                path: '/login',
                                element: <Login/>
                            },
                            {
                                path: '*',
                                element: <NotFoundPage/>
                            },
                        ]
                }
            ]
        },
    ]
);

const App = () => {
    useAuctionsUpdates();
    return (
        <RouterProvider router={router}/>
    )
};

export default App;
