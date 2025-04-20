import express from "express"
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import TaskModel from "../models/task.js"
import UsersModel from "../models/user.js"
import mongoose from "mongoose"

const router = express.Router()

var cache = new Map()


router.post("/tasks", async (req, res, next) => {
    const { title, description, assignee, priority, dueDate } = req.body;
    const _id = req.auth._id;
    const createdBy = _id
    if (!mongoose.Types.ObjectId.isValid(_id) || !mongoose.Types.ObjectId.isValid(assignee)) {
        return res.status(StatusCodes.BAD_REQUEST).send({message: "bad mongo id format."});
    }
    const validationResult = await validation({ title, description, assignee, priority, dueDate, createdBy });

    if (!validationResult.isValid) {
        return res.status(validationResult.status).send(validationResult.reason);
    }

    const task = await TaskModel.insertOne({
        title,
        assignee: assignee,
        createdAt: Date.now(),
        createdBy: createdBy,
        description,
        dueDate,
        priority,
        status: 'pending',
        updatedAt: Date.now()
    });

    res.status(StatusCodes.CREATED).send(task);
    next();
});

router.get("/tasks", async (req,res,next)=>{ 
    /*
    This endpoint will not return jwt back.
     */
    var status = StatusCodes.OK
    var reason = ReasonPhrases.OK
    if (!req.auth._id) { 
        status = StatusCodes.UNAUTHORIZED
        reason = {
            message: ReasonPhrases.UNAUTHORIZED
        }
    }
    else{
        const taskid = req.params.id
        const tasks = await TaskModel.find({
            $or: [
            { assignee: req.auth._id },
            { createdBy: req.auth._id }
            ]
        }).catch(error =>{
            reason = {message: error}
            status = StatusCodes.NOT_FOUND
        });    
        if (!tasks){
            status = StatusCodes.BAD_REQUEST
            reason = {
                message: ReasonPhrases.BAD_REQUEST
            }
        }else {
            reason = {tasks: tasks}
        }
    }
    res.status(status).header('authorization',req.header('authorization')).send(reason)
    next()
})

router.get("/tasks/:id", async (req,res,next)=>{ 
    /*
    This endpoint will not return jwt back.
     */
    var status = StatusCodes.OK
    var reason = ReasonPhrases.OK
    if (mongoose.Types.ObjectId.isValid(req.params.id) === false){
        res.status(StatusCodes.NOT_FOUND).header('authorization',req.header('authorization')).send({message:"Bad id"})
        next()
        return
    }
    const username = req.auth.username
    const uid = cache.has(username) ? 
    cache.get(username)._id
    : await UsersModel.find({username:{
        $eq:username
    }})
    if (!cache.has(username)) {cache.set(username,uid)}
    const taskid = req.params.id
    const task = await TaskModel.findOne({
        _id: taskid,          // or `id: taskid` if you really named it “id”
        $or: [
          { assignee: uid },
          { createdBy: uid }
        ]
      });    
    if (!task){
        status = StatusCodes.NOT_FOUND
        reason = {
            message: ReasonPhrases.NOT_FOUND
        }
    }else {
        reason = task
    }
    res.status(status).header('authorization',req.header('authorization')).send(reason)
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
    var status = StatusCodes.OK
    var reason = {_id: req.params.id}
    if (mongoose.Types.ObjectId.isValid(req.auth._id) && mongoose.Types.ObjectId.isValid(req.params.id)){
        const response = await TaskModel.deleteOne({
            _id:{$eq: req.params.id},
            createdBy:{$eq: req.auth._id}
        }).catch(error => {
            status = StatusCodes.NOT_FOUND
            reason = {message: error}
        })
        
    }
    res.status(status).send(reason)
    next()
})


async function validation({ title, description, assignee, priority, dueDate, createdBy }) {
    if (!title || title.trim() === "") {
        return { isValid: false, status: StatusCodes.BAD_REQUEST, reason: { message: "There is no title." } };
    }

    if (!description || description.trim() === "") {
        return { isValid: false, status: StatusCodes.BAD_REQUEST, reason: { message: "There is no description." } };
    }

    if (!priority || priority.trim() === "") {
        return { isValid: false, status: StatusCodes.BAD_REQUEST, reason: { message: "There is no priority." } };
    }

    if (!dueDate || Date.now() > dueDate) {
        return { isValid: false, status: StatusCodes.BAD_REQUEST, reason: { message: "The due date is before now." } };
    }

    if (!createdBy || createdBy.trim() === "") {
        return { isValid: false, status: StatusCodes.BAD_REQUEST, reason: { message: "There is no createdBy." } };
    }

    let user = cache.has(createdBy)
        ? cache.get(createdBy)
        : await UsersModel.findById(createdBy)

    if (!user) {
        return { isValid: false, status: StatusCodes.BAD_REQUEST, reason: { message: "The user creating isn't a real user." } };
    }
    cache.set(createdBy, user);

    user = cache.has(assignee)
        ? cache.get(assignee)
        : await UsersModel.findById(assignee);

    if (!user) {
        return { isValid: false, status: StatusCodes.BAD_REQUEST, reason: { message: "The assignee isn't a real user." } };
    }
    cache.set(assignee, user);

    return { isValid: true };
}

export default router;