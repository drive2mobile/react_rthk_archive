import { BrowserRouter, Route, Routes } from "react-router-dom";
import SelectProgram from "./pages/SelectProgram";

function App() {
    return (
        <BrowserRouter basename="/rthk_archive">
            <Routes>
                <Route exact path="/selectprogram" element={<SelectProgram />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
