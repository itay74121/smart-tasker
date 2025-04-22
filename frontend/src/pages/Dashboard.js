import React from 'react';
import Box from '@mui/material/Box';
import MenuIcon from "@mui/icons-material/Menu"
import { Accordion, AppBar, Toolbar,  } from '@mui/material';

function Dashboard() {
  return (
    <Box>
        <AppBar position='static'>
            <Toolbar>

            <MenuIcon />
               
            </Toolbar>
            <Accordion children={[]}/>
        </AppBar>
    </Box>
  );
}

export default Dashboard;