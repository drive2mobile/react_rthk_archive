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

    const [stationList, setStationList] = useState([]);
    const [programList, setProgramList] = useState({});
    const [displayList, setDisplayList] = useState([]);
    const [keyword, setKeyword] = useState('');

    const[showLoading, setShowLoading] = useState(false);
    const[showContent, setShowContent] = useState(false);

    const[toastText, setToastText] = useState('');
    const[toastTrigger,setToastTrigger] = useState(0);

    useEffect(() => {
        initialize();
    },[])

    async function initialize()
    {
        const response = await fetch(`${process.env.PUBLIC_URL}/json_files/programs.json`);
        const newProgramList = await response.json();
        setProgramList(newProgramList);

        const responseStation = await fetch(`${process.env.PUBLIC_URL}/json_files/stations.json`);
        const newStationList = await responseStation.json();
        setStationList(newStationList);

        console.log(newProgramList['radio1']);
        setDisplayList(newProgramList['radio1']);

        setShowContent(true);

    
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

                            <div style={{width:'calc(100% - 4px)', height:'58px', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                {stationList.length > 0 && stationList.map((item, index) => (
                                    <div style={{ width:'calc(20% - 4px)', height:'50px', textAlign:'center'}} key={index}>
                                        <Button variant="light" size='lg' className={styles.buttonGeneral} >{item}</Button>
                                    </div>
                                ))}
                            </div>

                            <div style={{width:'100%', height:'calc(100dvh - 50px - 58px)', overflow: 'auto', scrollbarWidth: 'none'}}>

                                {displayList.length > 0 && displayList.map((item, index) => (
                                    <div style={{width:'100%', height:'58px', display:'flex', flexDirection:'column', alignItems:'center'}} 
                                        key={index}
                                        onClick={() => { navigate(`/selectdate?programname=${item['program_name']}&stationname=${item['station_name']}&`+
                                                                    `programid=${item['program_id']}&stationid=${item['station_id']}`)}}
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