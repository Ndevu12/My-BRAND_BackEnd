import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async (): Promise<void> => {
  try {
    const dburl = String(process.env.DB_URL) || "";

    await mongoose.connect(dburl);
    console.log(
      `${
        process.env.NODE_ENV === "test"
          ? "Testing Database connected successfully!"
          : "Database connected successfully!"
      }`
    );
  } catch (error) {
    // console.log("Error while connecting to DataBase",error);
    console.error({ error: (error as Error).message });
  }
};

export { connectDb };
