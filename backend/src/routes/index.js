import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the Express app!');
});

export const setRoutes = (app) => {
    app.use('/', router);
};