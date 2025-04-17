import express from 'express';
import health from '../controllers/health.js';
import register from "../controllers/register.js"
import login from "../controllers/login.js"
import tasks from "../controllers/tasks.js"
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the Express app!');
});

export const setRoutes = (app) => {
    app.use('/', router);
    app.use('/api', health);
    app.use('/api', register);
    app.use('/api', login);
    app.use('/api', tasks);
};