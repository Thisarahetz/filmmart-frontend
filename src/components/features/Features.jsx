import React from 'react'
import "./features.scss";
import FiberNewIcon from '@mui/icons-material/FiberNew';

/*home (type)props pass main componet*/
const Features = ({type}) => {
    return (
        <>
        <div className="features">
        {type&&(
           <div className="category">
                <span>{type==='movies' ? 'Movie' : 'Series'}</span>
                <select name="genre" id="genre" >
                <option>Genre</option>
                <option value="adventure">Adventure</option>
                <option value="comedy">Comedy</option>
                <option value="crime">Crime</option>
                <option value="fantasy">Fantasy</option>
                <option value="historical">Historical</option>
                <option value="horror">Horror</option>
                <option value="romance">Romance</option>
                <option value="sci-fi">Sai-Fi</option>
                <option value="thriller">Thriller</option>
                </select>
           </div>
        )}
        <img src="https://i.ibb.co/kDRSfGg/MTRA-com.png" alt=""/>
        <div className="description">
            Find Rating and reviews <br/> for the Newest <br/> Movie and TV Shows <br/> + <br/> Hash Links 
            <div className="buttons">
                <button className="play">
                    <FiberNewIcon/>
                    <span>Features</span>
                </button>
            </div>
        </div>
        </div>
        </>

    )
}

export default Features
