import express, { Application } from "express";
// import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDb } from "./start-ups/connectdb";

import Route from "./routes/index";

import { Documentation } from "./start-ups/APIs-Docs";
import { HomePage } from "./utils/templates/homePage";

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true, // Allow credentials if needed
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  // preflightContinue: true,
}));

// cookie-parser middleware
app.use(cookieParser());

app.use("/v1", Route);

// Set up mongoose connection
connectDb();

// SWAGGER DOCS
Documentation();

// Morgan format for logging
const morganFormat = ':method :url :status :response-time ms - :res[content-length]';
app.use(morgan(morganFormat));

app.get("/", (req, res) => {
  res.status(200).send(HomePage);
});

// Start the server
const PORT: number = Number(process.env.PORT) || 6090;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

export { app };
