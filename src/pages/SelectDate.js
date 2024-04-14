import { useEffect, useRef, useState } from "react";
import { Form, Button, Fade } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppBar from '../ui_components/AppBar';
import styles from './styles/SelectDateStyle.module.css';
import SpinnerFullscreen from '../ui_components/SpinnerFullscreen';
import ToastAlert from '../ui_components/ToastAlert';
import axios from 'axios';
import * as Icon from 'react-bootstrap-icons';
import { selectDate, selectProgram } from "../utilies/Locale";
import { downloadM3u8Suffix, downloadURLSample } from "../utilies/Constants";

const SelectDate = () => {
    var backBtn = <Icon.ArrowLeft onClick={() => navigate('/', { replace: true })} style={{width:'50px', height:'50px', padding:'10px'}} />;
    var shareBtn = <Icon.ShareFill onClick={() => shareLink() } style={{width:'50px', height:'50px', padding:'13px'}} />;
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const[lang, setLang] = useState('tc');

    const [programName, setProgramName] = useState('');
    const [stationName, setStationName] = useState('');
    const [downloadURL, setDownloadURL] = useState('');

    const [datePivot, setDatePivot] = useState(null);
    const [dateList, setDateList] = useState([]);

    const[showLoading, setShowLoading] = useState(false);
    const[showContent, setShowContent] = useState(false);

    const[toastText, setToastText] = useState('');
    const[toastTrigger,setToastTrigger] = useState(0);

    const [selectedDateIndex, setSelectedDateIndex] = useState(-5);
    const [isDownloading, setIsDownloading] = useState(false);
    const isCancelDownload = useRef(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    const [triggerRefreshDate, setTriggerRefreshDate] = useState(false);
    const [triggerDownload, setTriggerDownload] = useState(false);

    useEffect(() => {
        initialize();
    },[])

    useEffect(() => {
        async function innerFun()
        {
            if (triggerRefreshDate)
            {
                setShowLoading(true);
                await refreshDate();
                setTriggerRefreshDate(false);
                setShowLoading(false);
            }
        }
        innerFun();
    }, [triggerRefreshDate])

    useEffect(() => {
        async function innerFun()
        {
            if (triggerDownload)
            {
                await downloadProgram();
                setTriggerDownload(false);
            }
        }
        innerFun();
    }, [triggerDownload])

    async function initialize()
    {
        setDatePivot(new Date());

        const newProgramName = urlParams.has('programname') ? urlParams.get('programname') : '';
        const newStationName = urlParams.has('stationname') ? urlParams.get('stationname') : '';
        const newProgramId = urlParams.has('programid') ? urlParams.get('programid') : '';
        const newStationId = urlParams.has('stationid') ? urlParams.get('stationid') : '';
        setProgramName(newProgramName);
        setStationName(newStationName);

        var newDownloadURL = downloadURLSample.replace('STATION', newStationId);
        newDownloadURL = newDownloadURL.replace('PROGRAM', newProgramId);
        setDownloadURL(newDownloadURL);

        setShowContent(true);
        setTriggerRefreshDate(true);
    }

    async function refreshDate(){
        var newDateList = [];
        var dateCount = 0;
        var successCount = 0;

        while(successCount <= 7)
        {
            const date = new Date(datePivot);
            date.setDate(date.getDate() - dateCount); 
            dateCount = dateCount + 1;
            const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '');

            var isSuccess = null;
            var currDownloadURL = downloadURL.replace('DATE', formattedDate) + downloadM3u8Suffix;
            try
            {
                const response = await axios.get(currDownloadURL);
                await new Promise(resolve => setTimeout(resolve, 50));
                isSuccess = true;
            }
            catch
            {
                isSuccess = false;
            }

            if (isSuccess)
            {
                if (successCount == 7)
                    setDatePivot(date);
                else
                    newDateList.push(formattedDate); 

                successCount++;
            }
        }
        setDateList(newDateList);
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

    async function downloadProgram()
    {
        setIsDownloading(true);
        setDownloadProgress(0);

        const url = downloadURL.replace('DATE', dateList[selectedDateIndex]) + downloadM3u8Suffix;
        const response = await axios.get(url);
        const content = response.data;

        var splitArray = content.toString().split('\n');
        var tsFileUrls = [];
        for (var i=0 ; i<splitArray.length ; i++)
        {
            if (splitArray[i].substring(0, 7) == 'segment')
                tsFileUrls.push(splitArray[i]);
        }

        var tsFiles = [];
        for (var i=0 ; i<tsFileUrls.length ; i++)
        {
            if (isCancelDownload.current == false)
            {
                const url1 = downloadURL.replace('DATE', dateList[selectedDateIndex]) + tsFileUrls[i];
                const response1 = await axios.get(url1, { responseType: 'arraybuffer' });
                tsFiles.push(response1.data);
                setDownloadProgress(parseInt(i * 100 / tsFileUrls.length));

                await new Promise(resolve => setTimeout(resolve, 100));
            }
            else
            {
                break;
            }
            // if (i==10)
            //     break;
        }
        
        if (isCancelDownload.current == false)
        { 
            try 
            {
                const mergedBlobParts = [];
    
                for (var i=0 ; i<tsFiles.length ; i++)
                {
                    mergedBlobParts.push(new Blob([tsFiles[i]], { type: 'video/mp2t' }));
                }
    
                const dateStr = dateList[selectedDateIndex];
                const mergedBlob = new Blob(mergedBlobParts, { type: 'video/mp2t' });
                const downloadUrl = URL.createObjectURL(mergedBlob);
                const downloadLink = document.createElement('a');
                downloadLink.href = downloadUrl;
                downloadLink.download = `${programName} ${dateStr.substring(6,8)}-${dateStr.substring(4,6)}-${dateStr.substring(0,4)}.ts`;
                downloadLink.click();
                setDownloadProgress(100);
            } 
            catch (error) 
            {
                console.error('Error merging TS files:', error);
            }
        }
        else
        {
            isCancelDownload.current = false;
        }
        
        setIsDownloading(false);
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
                <AppBar leftIcon={backBtn} Header={selectDate[lang]} rightIcon={shareBtn}></AppBar>

                <Fade in={showContent} appear={true} style={{transitionDuration: '0.3s'}}>
                    <div style={{height:'calc(100dvh - 50px)'}}>
                        <div style={{height:'100%', width:'100%'}}>

                            <Button onClick={() => {console.log(datePivot.toISOString().slice(0, 10).replace(/-/g, ''));}}>Test</Button>
                            <Button onClick={() => {setTriggerRefreshDate(true)}}>Refresh</Button>
                            {/* ==== PROGRAM NAME ===== */}
                            <div style={{width:'100%', height:'58px'}}>
                                <div style={{width:'calc(100% - 16px)', height:'50px', display:'flex', flexDirection:'row',
                                    backgroundColor:'white', borderRadius:'4px', border: '1px solid #e2e2e2', lineHeight:'50px'}}>
                                    <div style={{width:'80%'}}>{programName}</div>
                                    <div style={{width:'20%'}}>{stationName}</div>
                                </div>
                            </div>

                            {/* ===== DISPLAY LIST ==== */}
                            <div style={{width:'100%', height:'calc(100dvh - 50px - 50px)', overflow: 'auto', scrollbarWidth: 'none'}}>

                                {dateList.length > 0 && dateList.map((item, index) => (
                                    <div key={index} style={index == selectedDateIndex ? 
                                        {width:'100%', height:'158px', display:'flex', flexDirection:'column', alignItems:'center'} :
                                        {width:'100%', height:'58px', display:'flex', flexDirection:'column', alignItems:'center'}} 
                                    >

                                        <div style={index == selectedDateIndex ?
                                            {width:'calc(100% - 16px)', height:'150px', backgroundColor:'white', borderRadius:'4px', border: '1px solid #e2e2e2'} :
                                            {width:'calc(100% - 16px)', height:'50px', backgroundColor:'white', borderRadius:'4px', border: '1px solid #e2e2e2'}}
                                            onClick={() => {
                                                if (isDownloading == false)
                                                    setSelectedDateIndex(index);
                                            }}
                                        >
                                            <div style={{width:'100%', lineHeight:'50px', paddingLeft:'15px', paddingRight:'4px'}}>
                                                <div style={{width:'80%'}}>
                                                    {`${item.substring(6,8)}-${item.substring(4,6)}-${item.substring(0,4)}`}
                                                </div>
                                            </div>

                                            {(index == selectedDateIndex)&& 
                                                <div style={{width:'100%', height:'100%'}}>
                                                    <div>
                                                        <Button variant="light" style={{width:'20%', height:'40px'}} 
                                                        onClick={() => setTriggerDownload(true)}>下載</Button>
                                                        <Button variant="light" style={{width:'20%', height:'40px'}} 
                                                        onClick={() => isCancelDownload.current = true}>Cancel</Button>
                                                    </div>
                                                    <div>
                                                        {downloadProgress}
                                                    </div>
                                                </div>
                                                
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

export default SelectDate