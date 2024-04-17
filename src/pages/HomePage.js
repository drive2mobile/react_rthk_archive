import { Button, Fade } from 'react-bootstrap';
import styles from './styles/HomePageStyle.module.css';
import * as ReactIcon from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.body}>
            <Fade in={true} appear={true} style={{ transitionDuration: '0.8s' }}>
                <div>
                    <div className={styles.contentContainer}>

                        <div className={styles.logoTitleContainer}>
                            <img src={`https://webappdev.info/rthk/images/rthk_logo.png`} style={{ width: '50%', height: 'auto' }} />
                            <div style={{ color: '#484848', fontSize: '25px', marginTop: '30px' }}>RTHK Archive</div>
                            <div style={{ color: '#484848', fontSize: '25px' }}>香港電台節目重溫</div>
                            <div style={{ color: '#484848', fontSize: '15px', marginTop: '50px' }}>此網站的內容均來自互聯網</div>
                        </div>

                        <div className={styles.shortcutContainer}>
                            <Button variant="light" size='lg' style={{ width: '25%', height: '130px'}} onClick={() => navigate('/selectprogram')}>
                                <div >
                                    <ReactIcon.BroadcastPin style={{ width: '50px', height: '50px', marginBottom: '10px'}} />
                                    <div style={{fontSize:'20px'}}>重溫節目</div>
                                </div>
                            </Button>

                            <Button variant="light" size='lg' style={{ width: '25%', height: '130px'}} onClick={() => navigate('/bookmark')}>
                                <div >
                                    <ReactIcon.Bookmarks style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
                                    <div style={{fontSize:'20px'}}>收藏節目</div>
                                </div>
                            </Button>

                            <Button variant="light" size='lg' style={{ width: '25%', height: '130px'}} onClick={() => navigate('/')}>
                                <div >
                                    <ReactIcon.QuestionSquare style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
                                    <div style={{fontSize:'20px'}}>使用教學</div>
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