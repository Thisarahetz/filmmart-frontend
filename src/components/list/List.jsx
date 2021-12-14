import './list.scss'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ListItem from '../listItem/ListItem';

export default function List() {
    return (
        <div className="list">
            <span className="listTitel">Explore what's new</span>
            <div className="wrapper">
            <ArrowBackIosNewOutlinedIcon className="sliderArrow left"/>
            <div className="container">
                    <ListItem/>
                    <ListItem/>
                    <ListItem/>
                    <ListItem/>
                    <ListItem/>
                    <ListItem/>
            </div>
            <ArrowForwardIosOutlinedIcon className="sliderArrow right"/>
            </div>
        </div>
    )
}
