import './list.scss'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ListItem from '../listItem/ListItem';
import { useState , useRef } from 'react';

export default function List() {
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
    
    return (
        <div className="list">
            <span className="listTitel">Explore what's new</span>
            <div className="wrapper">
            <ArrowBackIosNewOutlinedIcon
                className="sliderArrow left"
                onClick={()=>handleClick("left")}
                style={{display: !isMoved && "none"}} />
            <div className="container" ref={listRef}>
                    <ListItem index={0}/>
                    <ListItem index={1}/>
                    <ListItem index={2}/>
                    <ListItem index={3}/>
                    <ListItem index={4}/>
                    <ListItem index={5}/>
                    <ListItem index={6}/>
                    <ListItem index={7}/>
                    <ListItem index={8}/>
            </div>
            <ArrowForwardIosOutlinedIcon className="sliderArrow right" onClick={()=>handleClick("right")}/>
            </div>
        </div>
    )
}
