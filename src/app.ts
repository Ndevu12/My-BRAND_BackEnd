import express, { Application } from "express";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./start-ups/connectdb";
import Route from "./routes/index";
import { Documentation } from "./start-ups/APIs-Docs";
import { HomePage } from "./utils/templates/homePage";

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors({
        origin: [
        "http://localhost:3000", 
        "http://127.0.0.1:5501", 
        "http://localhost:5173",
        "http://localhost:5500",  // Add this if using Live Server
        "http://127.0.0.1:5500",  // Add this too
        "http://localhost:5501",  // Common Live Server port
        "null"  // Add this for file:// protocol during development
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  }));

// cookie-parser middleware
app.use(cookieParser());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Morgan logging middleware
const morganFormat = ':method :url :status :response-time ms - :res[content-length]';
app.use(morgan(morganFormat));

// ROUTES
app.use("/v1", Route);

// Set up mongoose connection
connectDB();

// SWAGGER DOCS
Documentation();

app.get("/", (req, res) => {
  res.status(200).send(HomePage);
});

// Start the server
const PORT: number = Number(process.env.PORT) || 6090;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

export { app };
