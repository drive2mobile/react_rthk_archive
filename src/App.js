import { BrowserRouter, Route, Routes } from "react-router-dom";
import SelectProgram from "./pages/SelectProgram";
import SelectDate from "./pages/SelectDate";
import HomePage from "./pages/HomePage";
import Bookmark from "./pages/Bookmark";



function App() {
    return (
        <BrowserRouter basename="/rthk">
            <Routes>
                <Route exact path="/" element={<HomePage/>}></Route>
                <Route exact path="/selectprogram" element={<SelectProgram />}></Route>
                <Route exact path="/selectdate" element={<SelectDate />}></Route>
                <Route exact path="/bookmark" element={<Bookmark />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
