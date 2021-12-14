import './list.scss'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ListItem from '../listItem/ListItem';
import { useRef } from 'react';

export default function List() {
    const listRef = useRef();

    const handleClick = (direction) => {
        let distance = listRef.current.getBoundingClientRect().x - 50

        console.log(distance)
        if(direction === "left") {
            listRef.current.style.transform = `translateX(${230 + distance }px)`
        }
    }
    
    return (
        <div className="list">
            <span className="listTitel">Explore what's new</span>
            <div className="wrapper">
            <ArrowBackIosNewOutlinedIcon className="sliderArrow left" onClick={()=>handleClick("left")}/>
            <div className="container" ref={listRef}>
                    <ListItem/>
                    <ListItem/>
                    <ListItem/>
                    <ListItem/>
                    <ListItem/>
                    <ListItem/>
            </div>
            <ArrowForwardIosOutlinedIcon className="sliderArrow right" onClick={()=>handleClick("right")}/>
            </div>
        </div>
    )
}
