import express from "express"

const router = express.Router()


router.post("/login",(req,res,next)=>{
    
    next()
})

export default router;