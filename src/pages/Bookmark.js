import { useEffect, useState } from "react";
import { Fade } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppBar from '../ui_components/AppBar';
import styles from './styles/BookmarkStyle.module.css';
import SpinnerFullscreen from '../ui_components/SpinnerFullscreen';
import ToastAlert from '../ui_components/ToastAlert';
import * as Icon from 'react-bootstrap-icons';
import { getStorageItemDB, setStorageItemDB } from "../utilies/LocalStorage";
import { bookmarks } from "../utilies/Locale";
import { hostURL, jsonFileSuffix } from "../utilies/Constants";
import ItemBookmark from "../ui_components/ItemBookmark";

const Bookmark = ({lang}) => {
    const navigate = useNavigate();

    const [bookmarkList, setBookmarkList] = useState({});
    const [displayList, setDisplayList] = useState([]);

    const[showLoading, setShowLoading] = useState(false);
    const[showContent, setShowContent] = useState(false);

    const[toastText, setToastText] = useState('');
    const[toastTrigger,setToastTrigger] = useState(0);

    var backBtn = <Icon.ArrowLeft onClick={() => navigate('/', { replace: true })} style={{width:'50px', height:'50px', padding:'10px', cursor:'pointer'}} />;

    useEffect(() => {
        if (lang != '')
            initialize();
    },[lang])

    async function initialize()
    {
        const responsePrograms = await fetch(`${hostURL}/json_files/programs.json${jsonFileSuffix}`);
        const tempProgramList = await responsePrograms.json();
        var newProgramList = {};
        for (const key in tempProgramList)
        {
            const currItem = tempProgramList[key];
            for (var i=0 ; i<currItem.length ; i++)
            {
                if (!newProgramList[currItem[i]['program_id']])
                    newProgramList[currItem[i]['program_id']] = currItem[i];
            }
        }

        const newBookmarkList =  await getStorageItemDB('bookmark');
        setBookmarkList(newBookmarkList);

        var newDisplayList = [];
        for (const key in newBookmarkList)
        {
            if (newProgramList[key])
                newDisplayList.push(newProgramList[key]);
        }

        setDisplayList(newDisplayList);

        setShowContent(true);
    }

    async function addBookmark(programId)
    {
        const newBookmark = {...bookmarkList};

        if (newBookmark.hasOwnProperty(programId))
            delete newBookmark[programId];
        else
            newBookmark[programId] = programId;
        
        setBookmarkList(newBookmark);
        await setStorageItemDB('bookmark', newBookmark);
    }

    return (
        <div className={styles.body}>

            {/* ===== LOADING SPINNER ===== */}
            <SpinnerFullscreen showLoading={showLoading}/>

            {/* ===== TOAST ===== */}
            <ToastAlert toastText={toastText} toastTrigger={toastTrigger}/>

            {/* ===== MAIN CONTENT ===== */}
            <div style={{height:'100dvh'}}>

                {/* ===== APP BAR ===== */}
                <AppBar leftIcon={backBtn} Header={bookmarks[lang]} rightIcon={null}></AppBar>

                <Fade in={showContent} appear={true} style={{transitionDuration: '0.3s'}}>
                    <div className={styles.contentContainer}>
                        
                        {/* ===== LEFT SECTION ===== */}
                        <div className={styles.leftSectionContainer}>
                            <div style={{width:'120px'}}>
                                <Icon.Bookmark 
                                    style={{height:'100px', width:'100px'}}/>
                            </div>
                            <div style={{width:'calc(100% - 120px)'}}>{bookmarks[lang]}</div>
                        </div>


                        {/* ===== SELECT PROGRAM =====  */}
                        <div className={styles.programContainer}>
                        <div className={styles.programSubContainer}>
                            {displayList.length > 0 && displayList.map((item, index) => (
                                <ItemBookmark index={index} item={item} addBookmark={addBookmark} bookmarkList={bookmarkList}/>
                            ))}
                        </div>
                        </div>

                    </div>
                </Fade>
            </div>
        </div>
    )
}

export default Bookmark