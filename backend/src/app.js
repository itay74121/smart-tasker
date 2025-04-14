import express from 'express';
import { logger } from './middleware/logger.js';
import { setRoutes } from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(logger);

// Routes
setRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});