import mongoose from "mongoose";
const dbConnection = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Databse connected : ${connect.connection.host}, ${connect.connection.name}`,
    );
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1); // if there is no error process should be exit.
  }
};

export default dbConnection;
