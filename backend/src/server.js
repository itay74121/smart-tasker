import express from 'express';
import { logger } from './middlewears/logger.js';
import { setRoutes } from './routes/index.js';
import { mongooseConnected } from './middlewears/mongo.js';

import { config } from 'dotenv';
import cors from 'cors'
import {silence, express_jwt_middlewear } from './middlewears/expressjwt.js';
import { initIO } from './utils/socket.js';
import {createServer} from 'http'
config()

const app = express();
const PORT = process.env.PORT || 3000;
//initio
const server = createServer(app)
const io = initIO(server)

// Middleware
app.use(cors())
app.use(logger);
app.use(express_jwt_middlewear)
app.use(silence);
app.use(express.json())
app.use(mongooseConnected)
// Routes
setRoutes(app);

server.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
}) 