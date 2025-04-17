import express from 'express';
import mongoose, { model } from 'mongoose';

const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok',mongoose_connected:mongoose.connection.readyState });
});

export default router;