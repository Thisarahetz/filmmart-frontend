import './list.scss'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ListItem from '../listItem/ListItem';
import { useState , useRef } from 'react';

export default function List(list) {
    const listRef = useRef();
    const [isMoved,setMoved] = useState(false);
    const [slideCounter, setslideCounter] = useState(0);

    const handleClick = (direction) => {
        setMoved(true);
        let distance = listRef.current.getBoundingClientRect().x - 50
        /*slider*/
        if(direction === "left" && slideCounter > 0) {
            setslideCounter(slideCounter-1);
            listRef.current.style.transform = `translateX(${230 + distance }px)`
        }
        if(direction === "right" && slideCounter < 4) {
            setslideCounter(slideCounter+1);
            listRef.current.style.transform = `translateX(${-230 + distance }px)`
        }
    }
    //console.log(list.type.title)
    return (
        <div className="list">
            <span className="listTitel">{list.type.title}</span>
            <div className="wrapper">
            <ArrowBackIosNewOutlinedIcon
                className="sliderArrow left"
                onClick={()=>handleClick("left")}
                style={{display: !isMoved && "none"}} />
            <div className="container" ref={listRef}>
            {
                list.type.content.map((item, index)=>(
                    <ListItem index={index} item={item}/>
                ))
            }
                    
            </div>
            <ArrowForwardIosOutlinedIcon className="sliderArrow right" onClick={()=>handleClick("right")}/>
            </div>
        </div>
    )
}
