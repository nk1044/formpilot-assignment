import express, {Request, Response, Express} from 'express';
import cors from 'cors';


export const app:Express = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());


app.get('/', (req:Request, res:Response) => {
  res.send('server is running');
});

app.get('/health-check', (req:Request, res:Response) => {
  res.send('server is healthy');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  