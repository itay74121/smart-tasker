import React, { useState } from 'react';
import { Box, Button, TextField, Typography  } from '@mui/material';
import landscape from "../assets/tree2.png"
import { login } from '../services/authService';
function Home() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const ratio = 45
    const other = 100 - ratio
    const sx1 = {
        width:"50%",
        boxShadow: '0px 0px 10px 5px rgba(0,0,0,0.1)'
    }
  return (
    <Box display="flex" flexDirection="row" >
        <img src={landscape} alt='landscape' style={{
            height:"100vh",
            width:`${other}vw`,
            zIndex:1
        }}/>
        <Box component={'section'} sx={{
        p:2,
        width:`${ratio}vw`,
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        padding:"0",
        boxShadow: '0px 0px 50px 0px rgba(0,0,0,0.4)',
        zIndex:99
        }}
        gap={3}>
            <Box position="absolute" 
            sx={{
                background:"rgba(163,224,199,255)",
                width:"35%",
                height:"50%",
                zIndex:-1,
                borderRadius:"15px",
                boxShadow: '0px 0px 50px 0px rgba(0,0,0,0.4)'
            }}  >

            </Box>

            <Typography variant='h5'> Welcome to Smart-Tasker! <br/> Please Sign-In </Typography>
            <TextField required={true} onChange={(e)=>{setUsername(e.target.value)}} label={"Username"} sx={{...sx1,background:"white",borderRadius:"5px"}} />
            <TextField required={true} onChange={(e)=>{setPassword(e.target.value)}} label={"Password"} sx={{...sx1,background:"white",borderRadius:"5px"}} type='password'/>
            <Button variant='contained' 
            onClick={async (event)=>{
                console.log(username,password)
                login(username,password)
            }}
            sx={{
                width:"50%",
                height:"5%",
                textTransform:"none",
                background:"#0b6a66",
                boxShadow: '0px 0px 10px 5px rgba(0,0,0,0.2)'
            }}
            > Sign In</Button>
        </Box>
    </Box>
    
  );
}

export default Home;