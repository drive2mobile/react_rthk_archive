import { BrowserRouter, Route, Routes } from "react-router-dom";
import SelectProgram from "./pages/SelectProgram";
import SelectDate from "./pages/SelectDate";
import HomePage from "./pages/HomePage";
import Bookmark from "./pages/Bookmark";
import { useEffect, useState } from "react";
import { getStorageItemDB, setStorageItemDB } from "./utilies/LocalStorage";
import Tutorial from "./pages/Tutorial";

function App() {
    const[lang, setLang] = useState('');

    useEffect(() => {
        initialize();
    },[])

    async function initialize()
    {
        const newLang =  await getStorageItemDB('lang');

        if (newLang['lang'] && newLang['lang'] != '')
            setLang(newLang['lang']);
        else
        {
            const newLang2 = {'lang':'tc'};
            await setStorageItemDB('lang', newLang2);
            setLang('tc');
        }
    }

    return (
        <BrowserRouter basename="/">
            <Routes>
                <Route exact path="/" element={<HomePage lang={lang} setLang={setLang}/>}></Route>
                <Route exact path="/selectprogram" element={<SelectProgram lang={lang}/>}></Route>
                <Route exact path="/selectdate" element={<SelectDate lang={lang}/>}></Route>
                <Route exact path="/bookmark" element={<Bookmark lang={lang}/>}></Route>
                <Route exact path="/tutorial" element={<Tutorial lang={lang}/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
