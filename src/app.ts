import express, { Application } from "express";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./OnStart/connectdb";

import Route from "./routes/index";

// import { seedCategories } from './populateDB/seedCategories';
// import { seedBlog } from './populateDB/seedBlog';
// import { seedUser } from './populateDB/seedUser';

import { Documentation } from "./OnStart/APIs-Docs";

dotenv.config();

const app: Application = express();

const client_url = process.env.CLIENT_URL;
if (!client_url) {
  throw new Error("CLIENT_URL is not defined in the environment variables.");
}

const corsOptions = {
    origin: client_url,
    credentials: true,
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(Route);

// Set up mongoose connection
connectDb();

// SWAGGER DOCS
Documentation();

// Seeds
// seedCategories();
// seedBlog ();
// seedUser();

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
            <li>/docs</li> <li>/blog/</li> <li>/category/</li> <li>/message</li> <li>/notification</li> <li>/user</li>
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
  console.log(`Server is running on port ${PORT}`);
});

export { app };
