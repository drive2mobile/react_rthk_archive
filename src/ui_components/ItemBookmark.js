import { useNavigate } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import { hostURL } from "../utilies/Constants";
import styles from './ItemBookmarkStyle.module.css';

const ItemBookmark = ({index, item, addBookmark, bookmarkList}) => {
    const navigate = useNavigate();

    return (
        <div 
            className={styles.program}
            key={index}   
            onClick={() => { navigate(`/selectdate?programID=${item['program_id']}&prevPage=bookmark`)}}
        >
            {/* PROGRAM IMAGE */}
            <div className={styles.programImage}>
                <img className={styles.programActualImage} src={`${hostURL}/images/${item['program_id']}.jpg`} />
            </div>

            {/* PROGRAM NAME */}
            <div className={styles.programName}>
                {item['program_name']}
            </div>

            {/* BOOKMARK ICON */}
            <div className={styles.programBookmark} onClick={async(e) => { e.stopPropagation(); await addBookmark(item['program_id']);}}>

                {bookmarkList.hasOwnProperty(item['program_id']) ? 
                    <Icon.StarFill className={styles.programBookmarkIconSelected}/> :
                    <Icon.Star className={styles.programBookmarkIconUnselected}/>
                }
                
            </div>
        </div>     
    )
}

export default ItemBookmark;