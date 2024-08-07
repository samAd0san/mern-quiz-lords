import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import router from './router/route.js';
import userRoutes from './router/userRoute.js';
import tokenAuth from './middlewares/auth.js';
import connect from './database/conn.js';

const app = express();

/** Load environment variables */
config();

/** App middlewares */
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

/** Application port */
const port = process.env.PORT || 8080;

/** Routes */
app.use('/api', router); /** APIs */
app.use('/users', userRoutes);
app.use(tokenAuth);

/** Root route */
app.get('/', (req, res) => {
    try {
        res.json("Get Request");
    } catch (error) {
        res.json(error);
    }
});

/** Start server only when we have a valid connection */
connect().then(() => {
    app.listen(port, () => {
        console.log(`Server connected to http://localhost:${port}`);
    });
}).catch(error => {
    console.error("Failed to start server due to database connection issues:", error);
});