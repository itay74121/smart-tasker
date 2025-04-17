import express from 'express';
import { logger } from './middlewears/logger.js';
import { setRoutes } from './routes/index.js';
import { mongooseConnected } from './middlewears/mongo.js';
import {expressjwt} from 'express-jwt'
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors())
app.use(logger);
app.use(expressjwt({
    algorithms:["HS256"],
    secret:process.env.SECRET,
}).unless({
    path:["/api/health","/api/register","/api/login"]
})
)
app.use(express.json())
app.use(mongooseConnected)
// Routes
setRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});