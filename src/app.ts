import express, { Application } from "express";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import connectDB from "./start-ups/connectdb";
import Route from "./routes/index";
import { Documentation } from "./start-ups/APIs-Docs";
import { HomePage } from "./utils/templates/homePage";

dotenv.config();

const app: Application = express();

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 40, // Limit each IP to 40 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "5 minutes"
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all requests
app.use(limiter);

// Get CORS origins from environment variable
const getCorsOrigins = (): string[] => {
  const corsEnv = process.env.CORS_ORIGINS;
  if (!corsEnv) return [];
  
  // Handle both single origin and comma-separated origins
  return corsEnv.includes(',') 
    ? corsEnv.split(',').map(origin => origin.trim())
    : [corsEnv.trim()];
};

const corsOrigins = getCorsOrigins();

// Middleware
app.use(express.json());
app.use(cors({
    origin: corsOrigins,
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
