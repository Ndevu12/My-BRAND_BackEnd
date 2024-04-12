import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from "./OnStart/connectdb.ts";

import Route from './routes/index.ts';

dotenv.config();

const app: Application = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use('/api', Route);

// Set up mongoose connection
connectDb();

// Start the server
const PORT: number = Number(process.env.PORT) || 7080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app };
