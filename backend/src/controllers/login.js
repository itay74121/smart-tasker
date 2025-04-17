import express from "express"
import UsersModel from "../models/user.js"
import {StatusCodes,ReasonPhrases} from 'http-status-codes'
import jsonwb from 'jsonwebtoken'
import {config} from 'dotenv'

config()
const router = express.Router()


router.post("/login",(req,res,next)=>{
    const {username, passwordhash} = req.body
    var status = StatusCodes.ACCEPTED
    var desc = ReasonPhrases.ACCEPTED
    UsersModel.find({
        username:{
            $eq:username
        },
        password:{
            $eq:passwordhash
        }
        }).then(res=>{
            if (res.length !== 1){
                throw "Failed Log in"
            }
        }).catch((reason)=>{
            status = StatusCodes.INTERNAL_SERVER_ERROR
            desc = ReasonPhrases.INTERNAL_SERVER_ERROR
        }).finally(()=>{
            var s = res.status(status)
            if (status === StatusCodes.ACCEPTED){
                var secret = process.env.SECRET
                var token = jsonwb.sign({username:username},secret,{"algorithm":"HS256",expiresIn:2*60*24})
                s = s.header("Authorization",token)
            }
            s.send({message:desc})
            next()
        })
})

export default router;