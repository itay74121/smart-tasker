import { Box, useTheme } from '@mui/material'
import axios from 'axios';
import { useEffect, useState } from 'react';
const apiUrl = process.env.REACT_APP_API_URL;

function DueTasks() {
    const api = axios.create({baseURL:apiUrl,withCredentials:true})
    const [tasks, setTasks] = useState([]);
    const theme  = useTheme()
    useEffect(()=>{
    axios.get(apiUrl+"/api/tasks",
    {
        withCredentials:true
    })
    .then((value)=>{
        console.log(value.data.tasks)
        setTasks(value.data.tasks)
    })
    .catch((reason)=>{
        console.log(reason)
    })
    },[])
    return ( 
    <Box sx={{
        border:"1px solid",
        borderRadius:"7px",
        width:"50vw",
        height:"50vh",
        marginLeft:"15vw",
        overflow:"scroll",
        
    }}>
    {tasks.map((task)=>{
        return (
        <Box sx={{
            display:"flex",
            flexDirection:"column",
            justifyContent:"center",
            margin:"5px",
            
        }}> 
            <Box sx={{
                border:"1px solid",
                borderRadius:"7px",
                boxShadow: '0px 0px 10px 1px rgba(0,0,0,0.2)'
            }}>
                {task.description}
                <br/>
                {task.dueDate}
            </Box>
        </Box>)
    })}
    </Box> );
}

export default DueTasks;