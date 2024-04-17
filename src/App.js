import { BrowserRouter, Route, Routes } from "react-router-dom";
import SelectProgram from "./pages/SelectProgram";
import SelectDate from "./pages/SelectDate";
import HomePage from "./pages/HomePage";
import Bookmark from "./pages/Bookmark";
import DownloadProgram from "./pages/DownloadProgram";



function App() {
    return (
        <BrowserRouter basename="/rthk">
            <Routes>
                <Route exact path="/" element={<HomePage/>}></Route>
                <Route exact path="/selectprogram" element={<SelectProgram />}></Route>
                <Route exact path="/selectdate" element={<SelectDate />}></Route>
                <Route exact path="/bookmark" element={<Bookmark />}></Route>
                <Route exact path="/download" element={<DownloadProgram />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
