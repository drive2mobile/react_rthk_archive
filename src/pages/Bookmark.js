import { useEffect, useState } from "react";
import { Form, Button, Fade } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppBar from '../ui_components/AppBar';
import styles from './styles/BookmarkStyle.module.css';
import SpinnerFullscreen from '../ui_components/SpinnerFullscreen';
import ToastAlert from '../ui_components/ToastAlert';
import axios from 'axios';
import * as Icon from 'react-bootstrap-icons';
import { selectProgram } from "../utilies/Locale";
import { getStorageItemDB, setStorageItemDB } from "../utilies/LocalStorage";

const Bookmark = () => {
    var backBtn = <Icon.ArrowLeft onClick={() => navigate('/', { replace: true })} style={{width:'50px', height:'50px', padding:'10px'}} />;
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const[lang, setLang] = useState('tc');

    const [bookmarkList, setBookmarkList] = useState({});
    const [programList, setProgramList] = useState({});
    const [displayList, setDisplayList] = useState([]);

    const[showLoading, setShowLoading] = useState(false);
    const[showContent, setShowContent] = useState(false);

    const[toastText, setToastText] = useState('');
    const[toastTrigger,setToastTrigger] = useState(0);

    useEffect(() => {
        initialize();
    },[])

    async function initialize()
    {
        const responsePrograms = await fetch(`${process.env.PUBLIC_URL}/json_files/programs.json`);
        const newProgramList = await responsePrograms.json();
        setProgramList(newProgramList);

        const newBookmarkList =  await getStorageItemDB('bookmark');
        setBookmarkList(newBookmarkList);

        var newDisplayList = [];
        for (const key in newProgramList)
        {
            const currItem = newProgramList[key];
            for (var i=0 ; i<currItem.length ; i++)
            {
                if (newBookmarkList.hasOwnProperty(currItem[i]['program_id']))
                    newDisplayList.push(currItem[i]);
            }
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
                <AppBar leftIcon={backBtn} Header={'收藏節目'} rightIcon={null}></AppBar>

                <Fade in={showContent} appear={true} style={{transitionDuration: '0.3s'}}>
                    <div className={styles.contentContainer}>
                        
                        {/* ===== LEFT SECTION ===== */}
                        <div className={styles.leftSectionContainer}>
                            <div style={{width:'120px'}}>
                                <Icon.Bookmark 
                                    style={{height:'100px', width:'100px'}}/>
                            </div>
                            <div style={{width:'calc(100% - 120px)'}}>收藏節目</div>
                        </div>


                        {/* ===== SELECT PROGRAM =====  */}
                        <div className={styles.programContainer}>
                        <div className={styles.programSubContainer}>
                            {displayList.length > 0 && displayList.map((item, index) => (
                                <div 
                                    className={styles.program}
                                    key={index}   
                                    onClick={() => { navigate(`/selectdate?programname=${item['program_name']}&stationname=${item['station_name']}&`+
                                        `programid=${item['program_id']}&stationid=${item['station_id']}&weekday=${item['weekday']}&`+
                                        ``)}}
                                >
                                    <div style={{width:'80px', height:'50px', display:'flex', flexDirection:'column', 
                                            alignItems:'center', padding:'4px'}}>
                                        <img src={`${process.env.PUBLIC_URL}/images/${item['program_id']}.jpg`} 
                                            style={{ width: 'auto', height:'100%', borderRadius:'4px' }}
                                        ></img>
                                    </div>
                                    <div style={{width:'calc(100% - 60px)'}}>
                                        {item['program_name']}
                                    </div>
                                    <div style={{width:'60px', height:'50px', textAlign:'center', display:'flex', flexDirection:'column', justifyContent:'center'}}
                                        onClick={async(e) => {
                                            e.stopPropagation();
                                            await addBookmark(item['program_id']);
                                        }}
                                    >
                                        {bookmarkList.hasOwnProperty(item['program_id']) ? 
                                            <Icon.StarFill style={{width:'20px', height:'20px', color:'#FBFA0D', margin:'auto'}}/> :
                                            <Icon.Star style={{width:'20px', height:'20px', color:'#6C6C6C', margin:'auto'}}/>
                                        }
                                    </div>
                                </div>     
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