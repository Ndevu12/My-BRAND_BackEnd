import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import { dirname, join } from 'path';
import { fileURLToPath } from 'url'; 


import Route from './routes/index.ts';


dotenv.config();

const app: Application = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());




app.use('/api', Route);


// Register path for homepage
const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, '../routes/../routes/')));

// Displaying home page for the user
app.get('/', (req: Request, res: Response) => {
  try {
    return res.sendFile('index.html', { root: join(__dirname, '../routes/../routes/') });
  } catch (e) {
    console.error("Failed to load home page.\n", e);
    res.status(500).json({ Error: 'Internal Server Error' });
  }
});

// Set up mongoose connection
mongoose.set("strictQuery", false);

const dev_db_url =
  "mongodb+srv://Ndevu:ndevuspace@cluster0.guntyex.mongodb.net/NdevuSpace?retryWrites=true&w=majority&appName=Cluster0";
const mongoDB: string = process.env.MONGODB_URI || dev_db_url;

main().catch((err: any) => console.log("Failed to connect to DataBase.\nHere is the error message:\n", err));
async function main() {
  await mongoose.connect(mongoDB);
}

// Start the server
const PORT: number = Number(process.env.PORT) || 7080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
