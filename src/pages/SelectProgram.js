import { useEffect, useState } from "react";
import { Button, Fade } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppBar from '../ui_components/AppBar';
import styles from './styles/SelectProgramStyle.module.css';
import SpinnerFullscreen from '../ui_components/SpinnerFullscreen';
import ToastAlert from '../ui_components/ToastAlert';
import * as Icon from 'react-bootstrap-icons';
import { selectProgram } from "../utilies/Locale";
import { getImageFromIndexedDB, getStorageItemDB, saveImageToIndexedDB, setStorageItemDB } from "../utilies/LocalStorage";
import { hostURL, jsonFileSuffix, stationList, weekdayList } from "../utilies/Constants";
import { AutoTextSize } from "auto-text-size";

const SelectProgram = ({lang}) => {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);

    const [bookmarkList, setBookmarkList] = useState({});
    const [displayList, setDisplayList] = useState([]);
    const [imageList, setImageList] = useState({});

    const [selectedStation, setSelectedStation] = useState('radio1');
    const [selectedWeekday, setSelectedWeekday] = useState('1');
    const [programList, setProgramList] = useState([]);
    const [triggerRefreshList, setTriggerRefreshList] = useState(false);

    const[showLoading, setShowLoading] = useState(false);
    const[showContent, setShowContent] = useState(false);
    const[showProgramList, setShowProgramList] = useState(false);

    const[toastText, setToastText] = useState('');
    const[toastTrigger,setToastTrigger] = useState(0);

    var backBtn = <Icon.ArrowLeft onClick={() => navigate('/', { replace: true })} style={{width:'50px', height:'50px', padding:'10px', cursor:'pointer'}} />;
    var shareBtn = <Icon.ShareFill onClick={() => shareLink() } style={{width:'50px', height:'50px', padding:'13px', cursor:'pointer'}} />;

    useEffect(() => {
        if (lang != '')
            initialize();
    },[lang])

    useEffect(() => {
        async function innerFun()
        {
            if (triggerRefreshList)
            {
                await refreshList();
                setTriggerRefreshList(false);
            }
        }
        innerFun();
    }, [triggerRefreshList])

    async function initialize()
    {
        setShowLoading(true);

        const date = new Date();
        const currWeekday = date.getDay();
        setSelectedWeekday(currWeekday);

        const responsePrograms = await fetch(`${process.env.PUBLIC_URL}/json_files/programs.json${jsonFileSuffix}`);
        const newProgramList = await responsePrograms.json();
        setProgramList(newProgramList);

        if (urlParams.has('selectedStation'))
            setSelectedStation(urlParams.get('selectedStation'));

        if (urlParams.has('selectedWeekday'))
            setSelectedWeekday(urlParams.get('selectedWeekday'));

        const newBookmarkList =  await getStorageItemDB('bookmark');
        setBookmarkList(newBookmarkList);

        setTriggerRefreshList(true);
        setShowLoading(false);
        setShowContent(true);
    }

    async function refreshList()
    {
        var newDisplayList = [];
        var searchArray = programList[selectedStation] ? programList[selectedStation] : [];

        if (searchArray.length > 0)
        {
            for (var i=0 ; i<searchArray.length ; i++)
            {
                if (searchArray[i]['weekday'].toString().includes(selectedWeekday))
                    newDisplayList.push(searchArray[i]);               
            }
            newDisplayList.sort((a, b) => parseInt(a.time) - parseInt(b.time));
    
            setShowProgramList(false);
            await new Promise(resolve => setTimeout(resolve, 300));
            setDisplayList(newDisplayList);
            setShowProgramList(true);
        }
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

    async function shareLink()
    {
        if (navigator.share) 
        {
            try 
            {
                await navigator.share({
                    title: 'Share Current Address',
                    url: window.location.href
                });
            } 
            catch (error) 
            {
                console.error('Error sharing link:', error);
            }
        } 
        else 
        {
            console.log('Web Share API not supported.');
        }
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
                <AppBar leftIcon={backBtn} Header={selectProgram[lang]} rightIcon={shareBtn}></AppBar>

                <Fade in={showContent} appear={true} style={{transitionDuration: '0.3s'}}>
                    <div className={styles.contentContainer}>

                        {/* ===== SELECT STATION =====  */}
                        <div className={styles.stationContainer}>
                            {stationList.length > 0 && stationList.map((item, index) => (
                                <Button 
                                    variant={item['station_id'] == selectedStation ? 'success':'light'} 
                                    size='sm'  
                                    className={styles.stationButton} 
                                    key={index}
                                    onClick={() => {
                                        setSelectedStation(item['station_id']);
                                        urlParams.set('selectedStation', item['station_id']);
                                        urlParams.set('selectedWeekday', selectedWeekday);
                                        navigate('?' + urlParams.toString(), { replace: true });
                                        setTriggerRefreshList(true);
                                    }}
                                >
                                    <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center'}}>
                                        <AutoTextSize maxFontSizePx='14' style={{width:'100%'}}>{item[`station_name_${lang}`]}</AutoTextSize>
                                    </div>
                                </Button>
                            ))}
                        </div>

                        {/* ===== SELECT WEEKDAY =====  */}
                        <div className={styles.stationContainer}>
                            {weekdayList.length > 0 && weekdayList.map((item, index) => (
                                <Button 
                                    variant={item['weekday_id'] == selectedWeekday ? 'success':'light'} 
                                    size='sm' 
                                    key={index}
                                    className={styles.weekdayButton} 
                                    onClick={() => {
                                        setSelectedWeekday(item['weekday_id']);
                                        urlParams.set('selectedStation', selectedStation);
                                        urlParams.set('selectedWeekday', item['weekday_id']);
                                        navigate('?' + urlParams.toString(), { replace: true });
                                        setTriggerRefreshList(true);
                                    }}
                                    
                                >
                                    <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center'}}>
                                        <AutoTextSize maxFontSizePx='14' style={{width:'100%'}}>{item[`weekday_name_${lang}`]}</AutoTextSize>
                                    </div>
                                </Button>
                            ))}
                        </div>

                        {/* ===== SELECT PROGRAM =====  */}
                        <div className={styles.programContainer}>
                        <div className={styles.programSubContainer}>   

                            {displayList.length > 0 && displayList.map((item, index) => (
                                <Fade in={showProgramList} appear={true} style={{transitionDuration: '0.3s'}}>
                                
                                <div 
                                    className={styles.program}
                                    key={index}   
                                    onClick={() => { navigate(`/selectdate?programID=${item['program_id']}&prevPage=selectProgram&`+
                                        `selectedStation=${selectedStation}&selectedWeekday=${selectedWeekday}`)}}
                                >
                                    <div style={{width:'80px', height:'50px', display:'flex', flexDirection:'column', 
                                            alignItems:'center', padding:'4px'}}>
                                        {/* <img src={imageList[item['program_id']]}  */}
                                        <img src={`${hostURL}/images/${item['program_id']}.jpg`}
                                            style={{ width: 'auto', height:'100%', borderRadius:'4px' }}
                                        ></img>
                                    </div>
                                    <div style={{width:'calc(100% - 60px)'}}>
                                        <AutoTextSize maxFontSizePx='16' style={{width:'100%'}}>{item['program_name']}</AutoTextSize>
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
                                </Fade>   
                            ))}

                        </div>
                        </div>

                    </div>
                </Fade>
            </div>
        </div>
    )
}

export default SelectProgram