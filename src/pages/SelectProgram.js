import { useEffect, useState } from "react";
import { Form, Button, Fade } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppBar from '../ui_components/AppBar';
import styles from './styles/SelectProgramStyle.module.css';
import SpinnerFullscreen from '../ui_components/SpinnerFullscreen';
import ToastAlert from '../ui_components/ToastAlert';
import axios from 'axios';
import * as Icon from 'react-bootstrap-icons';
import { selectProgram } from "../utilies/Locale";
import { getStorageItemDB, setStorageItemDB } from "../utilies/LocalStorage";

const SelectProgram = () => {
    var backBtn = <Icon.ArrowLeft onClick={() => navigate('/', { replace: true })} style={{width:'50px', height:'50px', padding:'10px'}} />;
    var shareBtn = <Icon.ShareFill onClick={() => shareLink() } style={{width:'50px', height:'50px', padding:'13px'}} />;
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const[lang, setLang] = useState('tc');

    const [bookmarkList, setBookmarkList] = useState({});
    const [weekdayList, setWeekDayList] = useState([]);
    const [stationList, setStationList] = useState([]);
    const [programList, setProgramList] = useState({});
    const [displayList, setDisplayList] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [selectedStation, setSelectedStation] = useState('radio1');
    const [selectedWeekday, setSelectedWeekday] = useState('1');
    const [triggerRefreshList, setTriggerRefreshList] = useState(false);

    const[showLoading, setShowLoading] = useState(false);
    const[showContent, setShowContent] = useState(false);

    const[toastText, setToastText] = useState('');
    const[toastTrigger,setToastTrigger] = useState(0);

    useEffect(() => {
        initialize();
    },[])

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
        const responseWeekday = await fetch(`${process.env.PUBLIC_URL}/json_files/weekday.json`);
        const newWeekdayList = await responseWeekday.json();
        setWeekDayList(newWeekdayList);
        
        const responsePrograms = await fetch(`${process.env.PUBLIC_URL}/json_files/programs.json`);
        const newProgramList = await responsePrograms.json();
        setProgramList(newProgramList);

        const responseStation = await fetch(`${process.env.PUBLIC_URL}/json_files/stations.json`);
        const newStationList = await responseStation.json();
        setStationList(newStationList);

        if (urlParams.has('defaultstation'))
            setSelectedStation(urlParams.get('defaultstation'));

        if (urlParams.has('defaultweekday'))
            setSelectedWeekday(urlParams.get('defaultweekday'));

        const newBookmarkList =  await getStorageItemDB('bookmark');
        setBookmarkList(newBookmarkList);

        setTriggerRefreshList(true);
        setShowContent(true);
    }

    async function refreshList()
    {
        var newDisplayList = [];
        var searchArray = programList[selectedStation];

        for (var i=0 ; i<searchArray.length ; i++)
        {
            if (searchArray[i]['weekday'].toString().includes(selectedWeekday))
                newDisplayList.push(searchArray[i]);               
        }
        newDisplayList.sort((a, b) => parseInt(a.time) - parseInt(b.time));

        setDisplayList(newDisplayList);
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
                                        setTriggerRefreshList(true);
                                    }}
                                >{item['station_name_tc']}</Button>
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
                                        setTriggerRefreshList(true);
                                    }}
                                    
                                >{item['weekday_name_tc']}</Button>
                            ))}
                        </div>

                        {/* ===== SELECT PROGRAM =====  */}
                        <div className={styles.programContainer}>

                            {displayList.length > 0 && displayList.map((item, index) => (
                                <div 
                                    className={styles.program}
                                    key={index}   
                                    onClick={() => { navigate(`/selectdate?programname=${item['program_name']}&stationname=${item['station_name']}&`+
                                        `programid=${item['program_id']}&stationid=${item['station_id']}&weekday=${item['weekday']}&`+
                                        `defaultstation=${selectedStation}&defaultweekday=${selectedWeekday}`)}}
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
                </Fade>
            </div>
        </div>
    )
}

export default SelectProgram