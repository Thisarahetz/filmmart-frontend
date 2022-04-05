import {useState,useEffect} from 'react';
import api from '../../api/post';
import './listItem.scss';
import StarRateIcon from '@mui/icons-material/StarRate';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link } from "react-router-dom";
export default function ListItem({index,item}) {
    //console.log(item);
    const [isHovered,setIsHovered] = useState(false);
    const [movies,setMovies] = useState({});

    useEffect(() =>{
        const getMovie = async() => {
            try {
                const res = await api.get("/movies/find/" +item,
                {
                    headers: {
                    token:
                        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMjJlNmNiM2ZlZDdlM2NjNzVhMDhhZiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY0OTE3NDgxNSwiZXhwIjoxNjQ5NjA2ODE1fQ.H8Bk8ZW53JOiV6xRykWsKsRVppXnDXghWCycbz3JRXQ"
                }}
            );
            setMovies(res.data);
            } catch (error) {
                console.log(error);
            }
            
        }
        getMovie();
    }
    ,[item]);
    //console.log(movies.data.img);
    //console.log(item);

    /*trailer testing*/
    //const trailer="https://firebasestorage.googleapis.com/v0/b/school-management-systeam.appspot.com/o/y2mate.com%20-%20SPIDERMAN%20FAR%20FROM%20HOME%20%20Official%20Trailer_1080p.mp4?alt=media&token=a3f38695-9618-4188-a634-72c07133a120";

    return (
        <>
        <Link to={{pathname:"/details",movie:movies}} className="link">
        <div className="itemCard"
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
         style={{left: isHovered && index * 225 - 50 + index * 2.5}}>
            <div className="listItem">
            <img src={movies?.imgSm} alt="1q0NkU" border="0"/>  
            {isHovered && (
<>
            <video src={movies.trailer} autoPlay={true} loop />
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
                    <span>{movies.title} </span>
                    <span className="date">12 des 2021</span>
            </div>
        </div>
        </Link>
        </>
    )
}
