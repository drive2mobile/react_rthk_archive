import { Button, Fade } from 'react-bootstrap';
import styles from './styles/HomePageStyle.module.css';
import * as ReactIcon from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { allContentAreFromInternet, archive, bookmarks, rthkArchive, tutorial } from '../utilies/Locale';
import { AutoTextSize } from 'auto-text-size';
import { setStorageItemDB } from '../utilies/LocalStorage';

const HomePage = ({lang, setLang}) => {
    const navigate = useNavigate();

    async function changeLang(lang_in)
    {
        const newLang = {'lang':lang_in};
        await setStorageItemDB('lang', newLang);
        setLang(lang_in);
    }

    return (
        <div className={styles.body}>
            <Fade in={true} appear={true} style={{ transitionDuration: '0.8s' }}>
                <div>
                    <div style={{width:'100%', height:'40px', lineHeight:'40px', display:'flex', flexDirection:'row', justifyContent:'right'}}>
                        <div style={lang == 'tc' ?
                            {width:'30px', color:'#484848', fontWeight:'bold'} : 
                            {width:'30px', color:'#979797', fontWeight:'normal'}}
                            onClick={() => {changeLang('tc')}}
                        >
                            繁
                        </div>
                        <div style={lang == 'sc' ?
                            {width:'30px', color:'#484848', fontWeight:'bold'} : 
                            {width:'30px', color:'#979797', fontWeight:'normal'}}
                            onClick={() => {changeLang('sc')}}
                        >
                            簡
                        </div>
                        <div style={lang == 'en' ?
                            {width:'30px', color:'#484848', fontWeight:'bold', marginRight:'10px'} : 
                            {width:'30px', color:'#979797', fontWeight:'normal', marginRight:'10px'}}
                            onClick={() => {changeLang('en')}}
                        >Eng</div>
                    </div>

                    <div className={styles.contentContainer}>

                        <div className={styles.logoTitleContainer}>
                            <img src={`https://webappdev.info/rthk/images/rthk_logo.png`} style={{ width: '50%', height: 'auto' }} />
                            <div style={{ color: '#484848', fontSize: '25px', marginTop: '30px' }}>{rthkArchive[lang]}</div>
                            <div style={{ color: '#484848', fontSize: '15px', marginTop: '20px', width:'80%', textAlign:'center' }}>{allContentAreFromInternet[lang]}</div>
                        </div>

                        <div className={styles.shortcutContainer}>
                            <Button variant="light" size='lg' style={{ width: '25%', height: '130px'}} onClick={() => navigate('/selectprogram')}>
                                <div>
                                    <ReactIcon.BroadcastPin style={{ width: '50px', height: '50px', marginBottom: '10px'}} />
                                    <div>
                                        <AutoTextSize maxFontSizePx='18' style={{width:'100%'}}>{archive[lang]}</AutoTextSize>
                                    </div>
                                </div>
                            </Button>

                            <Button variant="light" size='lg' style={{ width: '25%', height: '130px'}} onClick={() => navigate('/bookmark')}>
                                <div>
                                    <ReactIcon.Bookmarks style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
                                    <div >
                                        <AutoTextSize maxFontSizePx='18' style={{width:'100%'}}>{bookmarks[lang]}</AutoTextSize>
                                    </div>
                                </div>
                            </Button>

                            <Button variant="light" size='lg' style={{ width: '25%', height: '130px'}} onClick={() => navigate('/')}>
                                <div>
                                    <ReactIcon.QuestionSquare style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
                                    <div>
                                        <AutoTextSize maxFontSizePx='18' style={{width:'100%'}}>{tutorial[lang]}</AutoTextSize>
                                    </div>
                                </div>
                            </Button>
                        </div>

                    </div>
                    <div style={{ width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', lineHeight: '40px' }}>
                        Beta 1.0
                    </div>
                </div>

            </Fade>
        </div>
    )
}

export default HomePage;