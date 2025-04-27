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
    var _id = ""
    UsersModel.findOne({
        username:{
            $eq:username
        },
        password:{
            $eq:passwordhash
        }
        }).then(res=>{
            _id = res._id
        }).catch((reason)=>{
            status = StatusCodes.INTERNAL_SERVER_ERROR
            desc = reason
        }).finally(()=>{
            var s = res.status(status)
            if (status === StatusCodes.ACCEPTED){
                var secret = process.env.SECRET
                var token = jsonwb.sign({username:username, _id:_id},secret,{"algorithm":"HS256",expiresIn:2*60*24*1000})
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,        // allow on localhost HTTP
                    sameSite: 'none',     // send on cross-site XHR
                    maxAge: 2 * 24 * 60 * 60 * 1000,
                    path: '/'
                  });
            }
            s.send({message:desc})
            next()
        })
})

export default router;