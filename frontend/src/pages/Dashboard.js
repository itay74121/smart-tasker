import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {  AppBar, Drawer, List, Toolbar } from '@mui/material';

import ListItem from '@mui/material/ListItem';
import DueTasks from '../components/DueTasks';

function Dashboard() {
  const [menuopen, setMenuOpen] = useState(false);
  return (
    <Box>
      <AppBar position="static">
        <Toolbar
          sx={{
            background: "rgba(163,224,199,255)",
          }}
        >
            <Drawer
              anchor="left" // Specify the anchor position
              open={menuopen} // Control the visibility of the drawer
              onClose={() => setMenuOpen(false)} // Close the drawer when clicking outside
              variant='permanent'
            >
              <List sx={{padding:"0px"}}>
                {["User", "Rooms", "Calander"].map((text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton sx={{borderBottom:"1px dashed"}}>
                      {index === 0 ? <PermIdentityOutlinedIcon sx={{marginRight:"10px"}}/> :null}
                      {index === 1 ? <Groups3OutlinedIcon sx={{marginRight:"10px"}}/> :null}
                      {index === 2 ? <CalendarTodayOutlinedIcon sx={{marginRight:"10px"}}/> :null}
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <SettingsOutlinedIcon sx={{position:'absolute',marginTop:'95vh'}}/>
            </Drawer>
           <DueTasks/>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Dashboard;