import {useState} from 'react';
import './listItem.scss';
import StarRateIcon from '@mui/icons-material/StarRate';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
export default function ListItem({index}) {
    const [isHovered,setIsHovered] = useState(false);
    /*trailer*/
    const trailer="https://firebasestorage.googleapis.com/v0/b/school-management-systeam.appspot.com/o/y2mate.com%20-%20SPIDERMAN%20FAR%20FROM%20HOME%20%20Official%20Trailer_1080p.mp4?alt=media&token=a3f38695-9618-4188-a634-72c07133a120";

    return (
        <>
        <div className="itemCard"
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
         style={{left: isHovered && index * 225 - 50 + index * 2.5}}>
            <div className="listItem">
            <img src="https://i.ibb.co/LkVfFwd/1q0NkU.jpg" alt="1q0NkU" border="0"/>  
            {isHovered && (
<>
            <video src={trailer} autoplay="true" loop />
            <div className="itemUperInfo">
                <div className="itemInfo">
                    <div className="ratingIcons">
                    <StarRateIcon/><StarRateIcon/><StarRateIcon/><StarRateIcon/><StarOutlineIcon/>
                    </div>
                    <div className="likeButton">
                    <FavoriteBorderIcon/>
                    </div>
                </div>
                <div className="itemDescription">
                        <div className="itemInfoTop">
                        <span>1 hour 14 mins</span>
                        <span className="limit">+16</span>
                        <span>1999</span>
                        </div>
                    <div className="desc">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, non maiores.
                        Architecto dolore, dolores quibusdam expedita cumque reiciendis similique 
                    </div>
                    <div className="genre">
                        Action
                    </div>
                </div>
            </div>
            </>
            )}
            </div>
            <div className="filmName">
                    <span>Film name (2021) </span>
                    <span className="date">12 des 2021</span>
            </div>
        
        </div>
        </>
    )
}
