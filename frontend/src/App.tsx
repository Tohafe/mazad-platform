import Home from "./pages/Home.tsx";
import {BrowserRouter} from "react-router-dom";

const App = () => {
    return (
        <BrowserRouter>
                <div>
                    <Home/>
                </div>
        </BrowserRouter>
    )
};

export default App;
