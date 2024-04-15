const  mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
// const dburl = process.env.DB_URL;
  // process.env.NODE_ENV === "test"
  //   ? process.env.DB_URL_TEST || ""
  //   : process.env.DB_URL || "";

const connectDb = async () => {
  try {
    const dburl ="mongodb+srv://Ndevu:ndevuspace@cluster0.guntyex.mongodb.net/NdevuSpace?retryWrites=true&w=majority&appName=Cluster0"; 
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
    console.error({ error: (error).message });
  }
};

connectDb();
