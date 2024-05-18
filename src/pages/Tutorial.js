import { useEffect, useState } from "react";
import { Fade } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppBar from '../ui_components/AppBar';
import styles from './styles/TutorialStyle.module.css';
import SpinnerFullscreen from '../ui_components/SpinnerFullscreen';
import ToastAlert from '../ui_components/ToastAlert';
import * as Icon from 'react-bootstrap-icons';
import { checkImageExistsInIndexedDB, getImageFromIndexedDB, getStorageItemDB, saveImageToIndexedDB, setStorageItemDB } from "../utilies/LocalStorage";
import { aboutMe, aboutMeDetail, bookmarks, contactMe, contactMeDetail, howToListen, tutorial } from "../utilies/Locale";
import { hostURL, jsonFileSuffix } from "../utilies/Constants";

const Tutorial = ({lang}) => {
    const navigate = useNavigate();

    const [bookmarkList, setBookmarkList] = useState({});
    const [displayList, setDisplayList] = useState([]);

    const[showLoading, setShowLoading] = useState(false);
    const[showContent, setShowContent] = useState(false);

    const[toastText, setToastText] = useState('');
    const[toastTrigger,setToastTrigger] = useState(0);

    const [img1, setImg1] = useState(null);
    const [img2, setImg2] = useState(null);

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

    return (
        <div className={styles.body}>

            {/* ===== LOADING SPINNER ===== */}
            <SpinnerFullscreen showLoading={showLoading}/>

            {/* ===== TOAST ===== */}
            <ToastAlert toastText={toastText} toastTrigger={toastTrigger}/>

            {/* ===== MAIN CONTENT ===== */}
            <div style={{height:'100dvh'}}>

                {/* ===== APP BAR ===== */}
                <AppBar leftIcon={backBtn} Header={tutorial[lang]} rightIcon={null}></AppBar>

                <Fade in={showContent} appear={true} style={{transitionDuration: '0.3s'}}>
                    <div className={styles.contentContainer}>
                        
                        <img src={img1} />

                        {/* ===== LEFT SECTION ===== */}
                        <div className={styles.leftSectionContainer}>
                            <div style={{width:'100%', textAlign:'center'}}>
                            <img src={`${hostURL}/images/sheep.png`} style={{textAlign:'center', height:'100px', width:'100px'}}/>
                            </div>
                            
                            <div style={{ marginTop:'30px', borderBottom:'2px solid #bdffb9', color:'#484848', fontSize:'24px', fontWeight:'bold'}}>{contactMe[lang]}</div>
                            <div style={{ margin:'5px', color:'#484848', fontSize:'16px'}}>
                                {contactMeDetail[lang]}
                            </div>
                        </div>

                        {/* ===== RIGHT SECTION ===== */}
                        <div className={styles.rightSectionContainer}>
                            <div style={{width:'100%', textAlign:'center'}}>
                            <img src={`${hostURL}/images/listen.png`} style={{textAlign:'center', height:'100px', width:'100px'}}/>
                            </div>

                            <div style={{ marginTop:'50px', borderBottom:'2px solid #bdffb9', color:'#484848', fontSize:'24px', fontWeight:'bold'}}>{howToListen[lang]}</div>
                            <div style={{ margin:'5px', color:'#484848', fontSize:'16px'}}>
                                Android:<br/>
                                VLC: <a href='https://play.google.com/store/apps/details?id=org.videolan.vlc&hl=en&gl=US'>VLC for Android - Google Play</a><br/>
                                MX Video: <a href='https://play.google.com/store/apps/details?id=com.mxtech.videoplayer.ad&hl=en&gl=US'>MX Player - Google Play</a><br/><br/>
                            </div>
                            <div style={{ margin:'5px', color:'#484848', fontSize:'16px'}}>
                                iPhone: <br/>
                                VLC: <a href='https://apps.apple.com/us/app/vlc-media-player/id650377962'>VLC media player - Apple Store</a><br/>
                                MX Video Player HD: <a href='https://apps.apple.com/us/app/mx-video-player-hd/id1425445169'>MX Video Player HD - Apple Store</a><br/>
                            </div>
                        </div> 
                    </div>
                </Fade>
            </div>
        </div>
    )
}

export default Tutorial