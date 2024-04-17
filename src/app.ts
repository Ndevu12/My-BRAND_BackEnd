import express, { Application } from 'express';
// import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from "./OnStart/connectdb.ts";

import Route from './routes/index.ts';

import { seedCategories } from './populateDB.ts/seedCategories.ts';
import { seedBlog } from './populateDB.ts/seedBlog.ts';
import { seedAuthor } from './populateDB.ts/seedAuthor.ts';
import { seedUser } from './populateDB.ts/seedUser.ts';
import { seedComment } from './populateDB.ts/seedComment.ts';
import { seedMessage } from './populateDB.ts/seedMessage.ts';
import { seedNotification } from './populateDB.ts/seedNotification.ts';
import { seedSubscriber } from './populateDB.ts/seedSubscriber.ts';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());


// cookie-parser middleware
app.use(cookieParser());


app.use('/api', Route);


// Set up mongoose connection
connectDb();


// Seeds
// seedCategories();
// seedBlog ();
// seedAuthor();
// seedUser();
// seedComment();
// seedMessage();
// seedNotification();
// seedSubscriber();

// Start the server
const PORT: number = Number(process.env.PORT) || 6090;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app };
 