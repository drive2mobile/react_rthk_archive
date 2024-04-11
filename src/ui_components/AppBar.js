import styles from './AppBarStyle.module.css';

const AppBar = ({leftIcon, Header, rightIcon}) => {
    return (
        <div className={styles.AppBar}> 
            <div className={styles.AppBarIcon}>{leftIcon}</div>
            <div className={styles.AppBarHeading}>{Header}</div>
            <div className={styles.AppBarIcon}>{rightIcon}</div>
        </div>
    )
}   

export default AppBar;