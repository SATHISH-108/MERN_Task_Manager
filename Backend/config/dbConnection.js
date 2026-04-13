import mongoose from "mongoose";

let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

const dbConnection = async () => {
  if (cached.conn) return cached.conn;
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, { bufferCommands: false })
      .then((m) => {
        console.log(`DB connected: ${m.connection.host}, ${m.connection.name}`);
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        console.error("DB connection error:", err);
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

export default dbConnection;
