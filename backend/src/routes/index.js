import express from 'express';
import { router as HealthRoute } from './api/health.js';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the Express app!');
});

export const setRoutes = (app) => {
    app.use('/', router);
    app.use('/api', HealthRoute);
};