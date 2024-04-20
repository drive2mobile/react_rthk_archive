import { BrowserRouter, Route, Routes } from "react-router-dom";
import SelectProgram from "./pages/SelectProgram";
import SelectDate from "./pages/SelectDate";
import HomePage from "./pages/HomePage";
import Bookmark from "./pages/Bookmark";
import DownloadProgram from "./pages/DownloadProgram";
import { useEffect, useState } from "react";
import { getStorageItemDB, setStorageItemDB } from "./utilies/LocalStorage";

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

        // const newLang2 = {'lang':'en'};
        // await setStorageItemDB('lang', newLang2);
        // setLang('en');
    }

    return (
        <BrowserRouter basename="/rthk">
            <Routes>
                <Route exact path="/" element={<HomePage lang={lang} setLang={setLang}/>}></Route>
                <Route exact path="/selectprogram" element={<SelectProgram lang={lang}/>}></Route>
                <Route exact path="/selectdate" element={<SelectDate lang={lang}/>}></Route>
                <Route exact path="/bookmark" element={<Bookmark lang={lang}/>}></Route>
                <Route exact path="/download" element={<DownloadProgram />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
