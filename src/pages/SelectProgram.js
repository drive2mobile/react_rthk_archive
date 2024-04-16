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

const SelectProgram = () => {
    var backBtn = <Icon.ArrowLeft onClick={() => navigate('/', { replace: true })} style={{width:'50px', height:'50px', padding:'10px'}} />;
    var shareBtn = <Icon.ShareFill onClick={() => shareLink() } style={{width:'50px', height:'50px', padding:'13px'}} />;
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const[lang, setLang] = useState('tc');

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
                    <div style={{height:'calc(100dvh - 50px)'}}>
                        <div style={{height:'100%'}}>

                            {/* ===== SELECT STATION =====  */}
                            <div style={{width:'calc(100% - 16px)', height:'48px', display:'flex', flexDirection:'row', 
                             justifyContent:'space-between', marginLeft:'8px', marginRight:'8px'}}>
                                {stationList.length > 0 && stationList.map((item, index) => (
                                    <div style={{ width:'calc(20% - 8px)', height:'40px', textAlign:'center', marginTop:'4px'}} key={index}>
                                        <Button variant={item['station_id'] == selectedStation ? 'success':'light'} size='sm' className={styles.buttonGeneral} 
                                            onClick={() => {
                                                setSelectedStation(item['station_id']);
                                                setTriggerRefreshList(true);
                                            }}
                                        >{item['station_name_tc']}</Button>
                                    </div>
                                ))}
                            </div>

                            {/* ===== SELECT WEEKDAY =====  */}
                            <div style={{width:'calc(100% - 16px)', height:'48px', display:'flex', flexDirection:'row', 
                             justifyContent:'space-between', marginLeft:'8px', marginRight:'8px'}}>
                                {weekdayList.length > 0 && weekdayList.map((item, index) => (
                                    <div style={{ width:'calc(14% - 8px)', height:'40px', textAlign:'center', marginTop:'4px'}} key={index}>
                                        <Button variant={item['weekday_id'] == selectedWeekday ? 'success':'light'} size='sm' className={styles.buttonGeneral} 
                                            style={{fontSize:'10px', padding:'0px'}}
                                            onClick={() => {
                                                setSelectedWeekday(item['weekday_id']);
                                                setTriggerRefreshList(true);
                                            }}
                                        >{item['weekday_name_tc']}</Button>
                                    </div>
                                ))}
                            </div>

                            {/* ===== SELECT PROGRAM =====  */}
                            <div style={{width:'100%', height:'calc(100dvh - 50px - 48px - 48px)', overflow: 'auto', scrollbarWidth: 'none'}}>

                                {displayList.length > 0 && displayList.map((item, index) => (
                                    <div style={{width:'100%', height:'58px', display:'flex', flexDirection:'column', alignItems:'center'}} 
                                        key={index}
                                        onClick={() => { navigate(`/selectdate?programname=${item['program_name']}&stationname=${item['station_name']}&`+
                                            `programid=${item['program_id']}&stationid=${item['station_id']}&weekday=${item['weekday']}&`+
                                            `defaultstation=${selectedStation}&defaultweekday=${selectedWeekday}`)}}
                                    >

                                        <div style={{width:'calc(100% - 16px)', height:'50px', display:'flex', flexDirection:'row', 
                                                backgroundColor:'white', borderRadius:'4px', border: '1px solid #e2e2e2', lineHeight:'50px'}}>
                                            <div style={{width:'20%', height:'50px', display:'flex', flexDirection:'column', 
                                                    alignItems:'center', padding:'4px'}}>
                                                <img src={`${process.env.PUBLIC_URL}/images/${item['program_id']}.jpg`} 
                                                    style={{ width: 'auto', height:'100%', borderRadius:'4px' }}
                                                ></img>
                                            </div>
                                            <div style={{width:'60%'}}>
                                                {item['program_name']}
                                            </div>
                                            <div style={{width:'20%', textAlign:'center'}}>
                                                {item['station_name']}
                                            </div>
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

export default SelectProgram