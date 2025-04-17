import express from "express"
import mongoose from "mongoose"
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import TaskModel from "../models/task.js"

const router = express.Router()

router.post("/tasks", async (req,res,next)=>{ 
    /*
    This endpoint will not return jwt back.
     */
    var status = StatusCodes.CREATED
    var reason = ReasonPhrases.CREATED
    
    res.status(status).send(reason)
    next()
})

router.get("/tasks", async (req,res,next)=>{ 
    /*
    This endpoint will not return jwt back.
     */
    var status = StatusCodes.CREATED
    var reason = ReasonPhrases.CREATED
    
    res.status(status).send(reason)
    next()
})

router.get("/tasks/:id", async (req,res,next)=>{ 
    /*
    This endpoint will not return jwt back.
     */
    var status = StatusCodes.CREATED
    var reason = ReasonPhrases.CREATED
    
    res.status(status).send(reason)
    next()
})

router.put("/tasks/:id", async (req,res,next)=>{ 
    /*
    This endpoint will not return jwt back.
     */
    var status = StatusCodes.CREATED
    var reason = ReasonPhrases.CREATED
    
    res.status(status).send(reason)
    next()
})

router.delete("/tasks/:id", async (req,res,next)=>{ 
    /*
    This endpoint will not return jwt back.
     */
    var status = StatusCodes.CREATED
    var reason = ReasonPhrases.CREATED
    
    res.status(status).send(reason)
    next()
})


export default router;