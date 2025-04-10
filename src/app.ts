import express, { Application } from "express";
// import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./start-ups/connectdb";

import Route from "./routes/index";

// import { seedCategories } from './populateDB/seedCategories';
// import { seedBlog } from './populateDB/seedBlog';
// import { seedAuthor } from './populateDB/seedAuthor';
// import { seedUser } from './populateDB/seedUser';
// import { seedComment } from './populateDB/seedComment';
// import { seedMessage } from './populateDB/seedMessage';
// import { seedNotification } from './populateDB/seedNotification';
// import { seedSubscriber } from './populateDB/seedSubscriber';

import { Documentation } from "./start-ups/APIs-Docs";

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// cookie-parser middleware
app.use(cookieParser());

app.use("/v1", Route);

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

app.get("/", (req, res) => {
  res.status(200).send(`
    <html>
      <head>
        <title>MyBrand API</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="<KEY>" crossorigin="anonymous">
      </head>
      <body>
        <div class="container" style.margin-top=10px>
          <div class="jumbotron">
            <h1 class="display-4">Welcome to MyBrand API</h1>
            <br><h2>Am Ndevu, a software developer</h2>
            <p class="lead">Use the following Endpoints to interact with the API:</p>
            <hr class="my-4">
            <ul>
            <li>/api-docs</li> <li>/api/blog/</li> <li>/api/category/</li> <li>/api/comment</li> <li>/api/message</li> <li>/api/notification</li> <li>/api/subscriber/</li> <li>/api/user</li>
            </ul>
          </div>
        </div>
      </body>
    </html>
  `);
});
// Start the server
const PORT: number = Number(process.env.PORT) || 6090;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

export { app };
