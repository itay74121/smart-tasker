import express from "express"
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import TaskModel from "../models/task.js"
import UsersModel from "../models/user.js"
import mongoose from "mongoose"

const router = express.Router()

var cache = new Map()


router.post("/tasks", async (req, res) => {
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

    return res.status(StatusCodes.CREATED).send(task);
});

router.get("/tasks", async (req,res)=>{ 
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
    return res.status(status).header('authorization',req.header('authorization')).send(reason)
})

router.get("/tasks/:id", async (req,res)=>{ 
    /*
    This endpoint will not return jwt back.
     */
    var status = StatusCodes.OK
    var reason = ReasonPhrases.OK
    if (mongoose.Types.ObjectId.isValid(req.params.id) === false){
        res.status(StatusCodes.NOT_FOUND).header('authorization',req.header('authorization')).send({message:"Bad id"})
        return
    }
    const id = req.auth._id
    const taskid = req.params.id
    const task = await TaskModel.findOne({
        _id: taskid,          // or `id: taskid` if you really named it “id”
        $or: [
          { assignee: id },
          { createdBy: id }
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
    return res.status(status).header('authorization',req.header('authorization')).send(reason)
})

router.put("/tasks/:id", async (req,res)=>{ 
    /*
    This endpoint will not return jwt back.
     */
    var status = StatusCodes.OK
    var reason = ReasonPhrases.OK
    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(StatusCodes.NOT_FOUND).header('authorization',req.header('authorization')).send({message:ReasonPhrases.NOT_FOUND})
        return 
    }
    
    if (await validateOwnerUserTask(req.auth._id,req.params.id)) {
        var updatevals = req.body
        const fields = ['title','description','assignee','priority','status','dueDate']
        for (const [key,value] of Object.entries(updatevals)){
            if (!fields.includes(key)){
                delete updatevals[key]
            }
        }
        reason = await TaskModel.findByIdAndUpdate(req.params.id,updatevals,{new:true})
    } 
    else{
        status = StatusCodes.NOT_FOUND
        reason = {message:ReasonPhrases.NOT_FOUND}
    }
    return res.status(status).header('authorization',req.header('authorization')).send(reason)
})

router.delete("/tasks/:id", async (req, res) => {
    var status = StatusCodes.OK;
    var reason = { _id: req.params.id };

    if (mongoose.Types.ObjectId.isValid(req.auth._id) && mongoose.Types.ObjectId.isValid(req.params.id)) {
        try {
            const response = await TaskModel.deleteOne({
                _id: { $eq: req.params.id },
                createdBy: { $eq: req.auth._id }
            });

            if (response.deletedCount === 0) {
                if (!await TaskModel.findById(req.params.id)){
                    status = StatusCodes.UNAUTHORIZED;
                    reason = { message: ReasonPhrases.UNAUTHORIZED };
                }
                else{
                    status = StatusCodes.NOT_FOUND;
                    reason = { message: ReasonPhrases.NOT_FOUND };
                }

            }
        } catch (error) {
            status = StatusCodes.INTERNAL_SERVER_ERROR;
            reason = { message: error.message };
        }
    } else {
        status = StatusCodes.NOT_FOUND;
        reason = { message: "Invalid ID format." };
    }

    return res.status(status).send(reason);
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
    cacheUser(createdBy,user)

    user = cache.has(assignee)
        ? cache.get(assignee)
        : await UsersModel.findById(assignee);

    if (!user) {
        return { isValid: false, status: StatusCodes.BAD_REQUEST, reason: { message: "The assignee isn't a real user." } };
    }
    cacheUser(assignee,user)

    return { isValid: true };
}
async function validateUser(uid) {
    if (!mongoose.Types.ObjectId.isValid(uid)) return false;
    try {
        const user = await UsersModel.findById(uid);
        return !!user; // Return true if user exists, false otherwise
    } catch (error) {
        return false; // Handle database errors gracefully
    }
}

async function validateOwnerUserTask(uid, task) {
    const validuser = await validateUser(uid)
    if (validuser && mongoose.Types.ObjectId.isValid(task)) {
        const taskDoc = await TaskModel.findById(task);
        if (!taskDoc) return false; // Handle case where task is not found
        console.log(taskDoc.createdBy + " " + uid )
        return taskDoc.createdBy.toString() === uid;
    } else {
        return false;
    }
}

function cacheUser(username, id, ttl=600000) {
    cache.set(username, id);
    setTimeout(() => cache.delete(username), ttl);
}
  
export default router;