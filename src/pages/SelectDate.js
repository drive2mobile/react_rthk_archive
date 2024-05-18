import { useEffect, useRef, useState } from "react";
import { Button, Fade, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppBar from '../ui_components/AppBar';
import styles from './styles/SelectDateStyle.module.css';
import SpinnerFullscreen from '../ui_components/SpinnerFullscreen';
import ToastAlert from '../ui_components/ToastAlert';
import axios from 'axios';
import * as Icon from 'react-bootstrap-icons';
import { loadMore30EP, loadMore7EP, selectDateOrEP, download, downloadingPleaseDontLeave, downloadCompleted, cancel } from "../utilies/Locale";
import { downloadM3u8Suffix, downloadURLSample, hostURL, jsonFileSuffix } from "../utilies/Constants";

const SelectDate = ({lang}) => {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const [returnURL, setReturnURL] = useState('');
    const [programName, setProgramName] = useState('');
    const [programId, setProgramId] = useState('');
    const [weekday, setWeekday] = useState('');
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
    const [isDownloadFinish, setIsDownloadFinish] = useState(false);
    const isCancelDownload = useRef(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    const [triggerRefreshDate, setTriggerRefreshDate] = useState(false);
    const [triggerDownload, setTriggerDownload] = useState(false);
    const [refreshDateCount, setRefreshDateCount] = useState(7);

    var backBtn = <Icon.ArrowLeft onClick={() => 
        {
            isCancelDownload.current = true;
            navigate(returnURL, { replace: true });    
        }
    } style={{width:'50px', height:'50px', padding:'10px', cursor:'pointer'}} />;
    var shareBtn = <Icon.ShareFill onClick={() => shareLink() } style={{width:'50px', height:'50px', padding:'13px', cursor:'pointer'}} />;

    useEffect(() => {
        initialize();
        return () => {
            isCancelDownload.current = true;
        };
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

        const newProgramID = urlParams.has('programID') ? urlParams.get('programID') : '';
        const prevPage = urlParams.has('prevPage') ? urlParams.get('prevPage') : '';
        const selectedStation = urlParams.has('selectedStation') ? urlParams.get('selectedStation') : '';
        const selectedWeekday = urlParams.has('selectedWeekday') ? urlParams.get('selectedWeekday') : '';

        if (prevPage == 'selectProgram')
            setReturnURL(`/selectprogram?selectedStation=${selectedStation}&selectedWeekday=${selectedWeekday}`);
        else if (prevPage == 'bookmark')
            setReturnURL('/bookmark');
        else
            setReturnURL('/');

        if (newProgramList[newProgramID])
        {
            setDatePivot(new Date());

            const newProgramObj = newProgramList[newProgramID];

            setProgramName(newProgramObj['program_name']);
            setStationName(newProgramObj['station_name']);
            setProgramId(newProgramID);
            setWeekday(newProgramObj['weekday']);
    
            var newDownloadURL = downloadURLSample.replace('STATION', newProgramObj['station_id']).replace('PROGRAM', newProgramID);
            setDownloadURL(newDownloadURL);

            setTriggerRefreshDate(true);
        }
        else
        {

        }
    }

    async function refreshDate(){
        var newDateList = [];
        var dateCount = 0;
        var successCount = 0;
        
        var tryCount = 0;
        var errorCount = 0;

        while(successCount <= refreshDateCount)
        {
            const date = new Date(datePivot);
            date.setDate(date.getDate() - dateCount); 
            dateCount = dateCount + 1;
            const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '');
            const currWeekday = date.getDay();

            var isSuccess = null;
            var currDownloadURL = downloadURL.replace('DATE', formattedDate) + downloadM3u8Suffix;
            var durationInSecond = 0;
            var segmentCount = 0;

            if (weekday.toString().includes(currWeekday) == false)
                continue;

            tryCount++;
            try
            {
                const response = await axios.get(currDownloadURL);
                const content = response.data;

                var m3u8Array = content.toString().split('\n');
                
                for (var i=0 ; i<m3u8Array.length ; i++)
                {
                    if (m3u8Array[i].substring(0, 7) == '#EXTINF')
                    {
                        const tempSplitArr = m3u8Array[i].split(':');
                        durationInSecond += Math.round(parseFloat(tempSplitArr[1].substring(0, tempSplitArr[1].length-1)));
                    }

                    if (m3u8Array[i].substring(0, 7) == 'segment')
                        segmentCount++;
                }

                // await new Promise(resolve => setTimeout(resolve, 50));
                isSuccess = true;
                successCount++;
            }
            catch
            {
                isSuccess = false;
                errorCount++;
            }

            if (isSuccess)
            {
                if (successCount == refreshDateCount)
                    setDatePivot(date);
                else
                {
                    const minutes = Math.floor(durationInSecond / 60);
                    const seconds = (durationInSecond % 60).toString().padStart(2, '0');

                    const fileSize = (segmentCount * 120 / 1024).toFixed(2);
                    newDateList.push({"date": formattedDate, "duration": `${minutes}:${seconds}`, "size":fileSize}); 
                }       
            }

            if (errorCount > 5)
            {
                if (errorCount > (tryCount/2))
                break;
            }

        }
        setDateList(prevArr => prevArr.concat(newDateList));
        
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

    async function downloadProgram()
    {
        setIsDownloading(true);
        setDownloadProgress(0);

        var tsFileUrls = [];

        try
        {
            const url = downloadURL.replace('DATE', dateList[selectedDateIndex]['date']) + downloadM3u8Suffix;
            const response = await axios.get(url);
            const content = response.data;
    
            var splitArray = content.toString().split('\n');
            
            for (var i=0 ; i<splitArray.length ; i++)
            {
                if (splitArray[i].substring(0, 7) == 'segment')
                    tsFileUrls.push(splitArray[i]);
            }
        }
        catch
        {

        }
        

        var tsFiles = [];
        try
        {
            for (var i=0 ; i<tsFileUrls.length ; i++)
            {
                if (isCancelDownload.current == false)
                {
                    const url1 = downloadURL.replace('DATE', dateList[selectedDateIndex]['date']) + tsFileUrls[i];
                    const response1 = await axios.get(url1, { responseType: 'arraybuffer' });
                    tsFiles.push(response1.data);
                    setDownloadProgress(parseInt(i * 100 / tsFileUrls.length));
    
                    // await new Promise(resolve => setTimeout(resolve, 500));
                }
                else
                {
                    break;
                }
                // if (i==10)
                //     break;
            }
        }
        catch { }
       
        if (isCancelDownload.current == false)
        { 
            try 
            {
                const mergedBlobParts = [];
    
                for (var i=0 ; i<tsFiles.length ; i++)
                {
                    mergedBlobParts.push(new Blob([tsFiles[i]], { type: 'video/mp2t' }));
                }
    
                const dateStr = dateList[selectedDateIndex]['date'];
                const mergedBlob = new Blob(mergedBlobParts, { type: 'video/mp2t' });
                const downloadUrl = URL.createObjectURL(mergedBlob);
                const downloadLink = document.createElement('a');
                downloadLink.href = downloadUrl;
                downloadLink.download = `${programName} ${dateStr.substring(6,8)}-${dateStr.substring(4,6)}-${dateStr.substring(0,4)}.ts`;
                downloadLink.click();
                setDownloadProgress(100);
                setIsDownloadFinish(true);
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
                <AppBar leftIcon={backBtn} Header={programName + " " + stationName} rightIcon={shareBtn}></AppBar>

                <Fade in={showContent} appear={true} style={{transitionDuration: '0.3s'}}>
                    <div className={styles.contentContainer}>

                        {/* ==== PROGRAM NAME ===== */}
                        <div className={styles.programDetailContainer}>
                            <div style={{width:'120px'}}>
                                <img src={`${hostURL}/images/${programId}.jpg`} 
                                    style={{height:'120px', width:'auto', padding:'10px', borderRadius:'15px'}}/>
                            </div>
                            <div style={{width:'calc(100% - 120px)'}}>{selectDateOrEP[lang]}</div>
                        </div>

                        {/* ===== DISPLAY LIST ==== */}
                        <div className={styles.dateListContainer}>
                        <div className={styles.dateListSubContainer}>

                            {dateList.length > 0 && dateList.map((item, index) => (
                                <div 
                                    key={index}
                                    style={index == selectedDateIndex ?
                                        {width:'calc(100% - 8px)', height:'150px', backgroundColor:'white', borderRadius:'4px', border: '1px solid #e2e2e2', margin:'4px'} :
                                        {width:'calc(100% - 8px)', height:'50px', backgroundColor:'white', borderRadius:'4px', border: '1px solid #e2e2e2', margin:'4px'}}
                                    onClick={() => {
                                        if (isDownloading == false)
                                        {
                                            setSelectedDateIndex(index);
                                            setIsDownloadFinish(false);
                                        } 
                                    }}
                                >
                                    <div style={{width:'100%', lineHeight:'50px', display:'flex', flexDirection:'row', cursor:'pointer'}}>
                                        <div style={{width:'75%', paddingLeft:'20px'}}>
                                            {`${item['date'].substring(6,8)}-${item['date'].substring(4,6)}-${item['date'].substring(0,4)}`}
                                        </div>
                                        <div style={{width:'25%', display:'flex', flexDirection:'column'}}>
                                            <div style={{lineHeight:'25px', fontSize:'14px'}}>
                                                <Icon.Clock style={{width:'12px', height:'12px', padding:'0px', margin:'0px'}}></Icon.Clock>&nbsp;
                                                {item['duration']}
                                            </div>
                                            <div style={{lineHeight:'25px', fontSize:'14px'}}>
                                                <Icon.FileEarmarkText style={{width:'12px', height:'12px'}}></Icon.FileEarmarkText>&nbsp;
                                                {item['size']} Mb
                                            </div>
                                        </div>
                                    </div>

                                    {index == selectedDateIndex && 
                                    <div style={{width:'100%', height:'100px'}}>
                                        {isDownloading == false && isDownloadFinish == false &&
                                            <div style={{height:'100%', lineHeight:'100px', textAlign:'center'}}>
                                                <Button variant="light" style={{width:'100px', height:'40px'}} 
                                                onClick={() => setTriggerDownload(true)}>{download[lang]}</Button>
                                            </div>
                                        }
                                        {isDownloading == true && isDownloadFinish == false &&
                                            <div style={{height:'100%', textAlign:'center'}}>
                                                <div style={{lineHeight:'30px', fontSize:'14px'}}>
                                                    {downloadingPleaseDontLeave[lang]}
                                                </div>
                                                <div style={{lineHeight:'30px', width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                                                    <ProgressBar variant="success" now={downloadProgress} style={{width:'60%'}} />
                                                </div>
                                                <div style={{lineHeight:'40px', textAlign:'center'}}>
                                                    <Button variant="light" style={{width:'100px', height:'35px'}} 
                                                    onClick={() => isCancelDownload.current = true}>{cancel[lang]}</Button>
                                                </div>
                                            </div>
                                        }
                                        {isDownloading == false && isDownloadFinish == true &&
                                            <div style={{height:'100%', textAlign:'center'}}>
                                                <div style={{lineHeight:'30px', fontSize:'14px'}}>
                                                    {downloadCompleted[lang]}
                                                </div>
                                                <div style={{lineHeight:'30px', width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                                                    <ProgressBar variant="success" now={100} style={{width:'60%'}} />
                                                </div>
                                            </div>  
                                        }
                                            
                                    </div>
                                    }

                                </div>    
                            ))}

                            <div style={{width:'100%', textAlign:'center', marginBottom:'10px'}}>
                                <Button variant="light" style={{marginRight:'5px'}} onClick={()=>{
                                    setRefreshDateCount(7);
                                    setTriggerRefreshDate(true);
                                }}>{loadMore7EP[lang]}</Button>
                                <Button variant="light" style={{marginLeft:'5px'}} onClick={()=>{
                                    setRefreshDateCount(30);
                                    setTriggerRefreshDate(true)
                                }}>{loadMore30EP[lang]}</Button>
                            </div>
                        </div>    
                        </div>

                    </div>
                </Fade>
            </div>
        </div>
    )
}

export default SelectDate