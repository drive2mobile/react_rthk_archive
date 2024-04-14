import { BrowserRouter, Route, Routes } from "react-router-dom";
import SelectProgram from "./pages/SelectProgram";
import SelectDate from "./pages/SelectDate";

function App() {
    return (
        <BrowserRouter basename="/rthk_archive">
            <Routes>
                <Route exact path="/selectprogram" element={<SelectProgram />}></Route>
                <Route exact path="/selectdate" element={<SelectDate />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
