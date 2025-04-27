import { Box } from '@mui/material'
import axios from 'axios';
import { useEffect, useState } from 'react';
const apiUrl = process.env.REACT_APP_API_URL;

function DueTasks() {
    const api = axios.create({baseURL:apiUrl,withCredentials:true})
    const [tasks, setTasks] = useState([]);
    useEffect(()=>{
    axios.get(apiUrl+"/api/tasks",
    {
        withCredentials:true
    })
    .then((value)=>{
        setTasks(value)
    })
    .catch((reason)=>{
        console.log(reason)
    })
    },[])
    return ( 
    <Box sx={{
        border:"1px solid",
        borderRadius:"7px"
    }}>
    {tasks.map((task)=>{
        return (
        <Box> 
            task.description
            task.dueDate
        </Box>)
    })}
    </Box> );
}

export default DueTasks;