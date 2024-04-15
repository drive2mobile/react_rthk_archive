import { BrowserRouter, Route, Routes } from "react-router-dom";
import SelectProgram from "./pages/SelectProgram";
import SelectDate from "./pages/SelectDate";
import Test from "./pages/Test";

function App() {
    return (
        <BrowserRouter basename="/rthk">
            <Routes>
                <Route exact path="/" element={<Test />}></Route>
                <Route exact path="/selectprogram" element={<SelectProgram />}></Route>
                <Route exact path="/selectdate" element={<SelectDate />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
