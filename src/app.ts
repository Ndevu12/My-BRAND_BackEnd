import express, { Application } from "express";
// import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./OnStart/connectdb";

import Route from "./routes/index";

// import { seedCategories } from './populateDB/seedCategories';
// import { seedBlog } from './populateDB/seedBlog';
// import { seedAuthor } from './populateDB/seedAuthor';
// import { seedUser } from './populateDB/seedUser';
// import { seedComment } from './populateDB/seedComment';
// import { seedMessage } from './populateDB/seedMessage';
// import { seedNotification } from './populateDB/seedNotification';
// import { seedSubscriber } from './populateDB/seedSubscriber';

import { Documentation } from "./OnStart/APIs-Docs";

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// cookie-parser middleware
app.use(cookieParser());

app.use("/api", Route);

// Set up mongoose connection
connectDb();

// SWAGGER DOCS
Documentation();

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
