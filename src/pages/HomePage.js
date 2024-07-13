import { Button, Fade } from 'react-bootstrap';
import styles from './styles/HomePageStyle.module.css';
import * as ReactIcon from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { allContentAreFromInternet, archive, bookmarks, rthkArchive, tutorial } from '../utilies/Locale';
import { AutoTextSize } from 'auto-text-size';
import { setStorageItemDB } from '../utilies/LocalStorage';
import { hostURL } from '../utilies/Constants';

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
                    <div className={styles.languageSelectionContainer}>
                        <div className={styles.languageBtn} style={{'--cusBold': lang == 'tc' ? 'bold':'normal'}}
                            onClick={() => {changeLang('tc')}}
                        >
                            繁
                        </div>
                        <div className={styles.languageBtn} style={{'--cusBold': lang == 'sc' ? 'bold':'normal'}}
                            onClick={() => {changeLang('sc')}}
                        >
                            簡
                        </div>
                        <div className={styles.languageBtn} style={{'--cusBold': lang == 'en' ? 'bold':'normal'}}
                            onClick={() => {changeLang('en')}}
                        >Eng</div>
                    </div>

                    <div className={styles.contentContainer}>

                        <div className={styles.logoTitleContainer}>
                            <img src={`${hostURL}/images/rthk_logo.png`} className={styles.mainLogo} />
                            <div className={styles.mainTitle}>{rthkArchive[lang]}</div>
                            <div className={styles.mainSubtitle}>{allContentAreFromInternet[lang]}</div>
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

                            <Button variant="light" size='lg' style={{ width: '25%', height: '130px'}} onClick={() => navigate('/tutorial')}>
                                <div>
                                    <ReactIcon.QuestionSquare style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
                                    <div>
                                        <AutoTextSize maxFontSizePx='18' style={{width:'100%'}}>{tutorial[lang]}</AutoTextSize>
                                    </div>
                                </div>
                            </Button>
                        </div>

                    </div>
                    <div className={styles.versionContainer}>
                        Beta 1.0
                    </div>
                </div>

            </Fade>
        </div>
    )
}

export default HomePage;