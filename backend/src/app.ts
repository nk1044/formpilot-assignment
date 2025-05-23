import express, {Request, Response, Express} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


export const app:Express = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.get('/', (req:Request, res:Response) => {
  res.send('server is running');
});

app.get('/health-check', (req:Request, res:Response) => {
  res.send('server is healthy');
});

import authRoute from './routes/auth.route.js';
app.use('/api/auth', authRoute);

import taskRoutes from './routes/task.route.js';
app.use('/api/v1', taskRoutes);
