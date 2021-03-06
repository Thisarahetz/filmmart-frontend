import React, {  useState } from "react";
import "./navbar.scss"
import SearchIcon from '@mui/icons-material/Search';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Sidebar from './Sidebar.js';

const Navbar = () => {
    const [isScrolled,setIsScrolled] = useState(false);

    window.onscroll = () => {
        setIsScrolled(window.pageYOffset === 0 ? false : true);
        return () => {window.onscroll = null};
    }

    return (
        <div className={isScrolled ? "navbar scollled": "navbar"}>
            <div className="contaner">
                <div className="left">
                <img src="https://i.ibb.co/v1MXJ2B/images.jpg" alt="logo"/>               
                <Sidebar className="navbar"/>                   
                    <Paper
                    component="form"
                    className="searchbar"
                    >                   
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search"
                        inputProps={{ 'aria-label': 'search' }}                        
                    />                   
                    <SearchIcon />                 
                    </Paper>                                            
                </div>
                <div className="right">
                <FacebookIcon className="rightItem"/>
                <YouTubeIcon/>
                <TwitterIcon/>
                <InstagramIcon/>
                </div>
            </div>
        </div>
    )
}

export default Navbar
