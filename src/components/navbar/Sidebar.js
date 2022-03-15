import React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import MovieIcon from '@mui/icons-material/Movie';
import TheatersIcon from '@mui/icons-material/Theaters';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import GroupIcon from '@mui/icons-material/Group';
import { Link } from "react-router-dom";
import "./sidebar.scss"

export default function Sidebar() {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
      });
    
      const toggleDrawer = (anchor, open) => (event) => {
        if (
          event &&
          event.type === 'keydown' &&
          (event.key === 'Tab' || event.key === 'Shift')
        ) {
          return;
        }
    
        setState({ ...state, [anchor]: open });
      };
    
      const list = (anchor) => (
        <Box
          sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <List>
              <Link to="/" className="link">
              <ListItem button>
                <ListItemIcon>
                <HomeIcon />
                </ListItemIcon>
                <ListItemText>Homepage</ListItemText>
              </ListItem>
              </Link>
              <Link to="/series"  className="link">
              <ListItem button>
              <ListItemIcon>
              <TheatersIcon />
              </ListItemIcon>
              <ListItemText>Serires</ListItemText>
            </ListItem>
            </Link>
            <Link to="/movies" className="link">
            <ListItem button>
            <ListItemIcon>
            <MovieIcon />
            </ListItemIcon>
            <ListItemText>Movies</ListItemText>
          </ListItem>
          </Link>
          <ListItem button>
          <ListItemIcon>
          <FiberNewIcon />
          </ListItemIcon>
          <ListItemText>New populer</ListItemText>
        </ListItem>
            
          </List>
          <Divider />
          <List>
            {['Contract us', 'Group'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index  === 0 ? <MailIcon /> : <GroupIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      );
      
      return (
        <div>
          {['left'].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button onClick={toggleDrawer(anchor, true)}><MenuIcon sx={{color: 'white',bgcolor:'black'}} anchor={anchor.left}/></Button>
              <SwipeableDrawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
                onOpen={toggleDrawer(anchor, true)}
              >
                {list(anchor)}
              </SwipeableDrawer>
            </React.Fragment>
          ))}         
        </div>
      );
    }
    