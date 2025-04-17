import express from "express"
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import TaskModel from "../models/task.js"
import UsersModel from "../models/user.js"

const router = express.Router()

var cache = new Map()


router.post("/tasks", async (req, res, next) => {
    const { title, description, assignee, priority, dueDate } = req.body;
    const createdBy = req.auth.username;

    const validationResult = await validation({ title, description, assignee, priority, dueDate, createdBy });

    if (!validationResult.isValid) {
        return res.status(validationResult.status).send(validationResult.reason);
    }

    const task = await TaskModel.insertOne({
        title,
        assignee: cache.get(assignee)[0]._id,
        createdAt: Date.now(),
        createdBy: cache.get(createdBy)[0]._id,
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
        : await UsersModel.find({ username: { $eq: createdBy } });

    if (!user || user.length !== 1) {
        return { isValid: false, status: StatusCodes.BAD_REQUEST, reason: { message: "The user creating isn't a real user." } };
    }
    cache.set(createdBy, user);

    user = cache.has(assignee)
        ? cache.get(assignee)
        : await UsersModel.find({ username: { $eq: assignee } });

    if (!user || user.length !== 1) {
        return { isValid: false, status: StatusCodes.BAD_REQUEST, reason: { message: "The assignee isn't a real user." } };
    }
    cache.set(assignee, user);

    return { isValid: true };
}

export default router;