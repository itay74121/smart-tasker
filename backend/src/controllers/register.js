import express from "express"
import mongoose from "mongoose"
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import UsersModel from "../models/user.js"

const router = express.Router()

router.post("/register", async (req,res,next)=>{ 
    /*
    This endpoint will not return jwt back.
     */
    var status = StatusCodes.CREATED
    var reason = ReasonPhrases.CREATED
    if (mongoose.connection.readyState === 1){
        const {username, email,name, lastname, role, passwordhash} = req.body
        // check if exists
        var userexist = await UsersModel.find({username:{$eq:username}})
        var emailexist = await UsersModel.find({email:{$eq:email}})
        // insert one if not 
        if (userexist.length === 0 && emailexist.length === 0){
            UsersModel.insertOne({
                username:username,
                email:email,
                name:name,
                lastname:lastname,
                password:passwordhash,
                role:role
            }).then((val)=>{
                console.log(val)
            }).catch((reason)=>{
                status = StatusCodes.INTERNAL_SERVER_ERROR
                reason = ReasonPhrases.INTERNAL_SERVER_ERROR
            })
        } 
        else{
            status = StatusCodes.BAD_REQUEST
            reason = ReasonPhrases.BAD_REQUEST
        }
        
    } else{
        status = StatusCodes.BAD_REQUEST
        reason = ReasonPhrases.BAD_REQUEST
    }
    res.status(status).send(reason)
    next()
})

export default router;