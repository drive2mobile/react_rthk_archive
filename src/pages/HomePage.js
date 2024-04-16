import { Button, Fade } from 'react-bootstrap';
import styles from './styles/HomePageStyle.module.css';
import * as ReactIcon from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const HomePage = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    // `${process.env.PUBLIC_URL}/picture/ragdoll1.jpg`
    return (
        <div className={styles.body}>
            <Fade in={true} appear={true} style={{transitionDuration: '0.8s'}}>
                <div style={{height:'100dvh'}}>
                    <div style={{ height: 'calc(100dvh - 50px - 180px - 40px)', display: 'flex', color:'#484848',
                    flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '25px', textAlign: 'center' }}>
                        <div>
                            <img src={`${process.env.PUBLIC_URL}/images/rthk_logo.png`} style={{ width: '50%', height: 'auto', padding: '0px', border: '0px solid black', borderRadius: '15px' }} />
                        </div>
                        <div style={{marginTop:'10px'}}>RTHK Archive</div>
                        <div>香港電台節目重溫</div>
                    </div>

                    <div style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        些網站的重溫內容均來自互聯網
                    </div>

                    <div style={{height:'180px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Button variant="light" size='lg' style={{width:'40%', height:'130px'}} onClick={() => navigate('/selectprogram')}>
                            <div >
                                <ReactIcon.Magic style={{width:'55px', height:'55px', marginBottom:'10px', marginRight:'7.5%'}}/>
                                <div>重溫節目</div>
                            </div>
                        </Button>

                        <Button variant="light" size='lg' style={{width:'40%', height:'130px', marginLeft:'7.5%'}} onClick={() => navigate('/')}>
                            <div >
                                <ReactIcon.Search style={{width:'55px', height:'55px', marginBottom:'10px'}}/>
                                <div>使用教學</div>
                            </div>
                        </Button>

                        
                    </div>
                    <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize:'12px', lineHeight:'40px' }}>
                        Beta 1.0
                    </div>
                    
                </div>
            </Fade>
        </div>
    )
}

export default HomePage;