import mongoose from "mongoose";

const connection_info = {
  is_connected: 0,
};

export const connect_db = async () => {
  try {
    if (connection_info.is_connected) {
      console.log("Mongodb is already connected");
    }
    const conn = await mongoose.connect(process.env.DB_URI!);
    connection_info.is_connected = conn.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Somethig went wrong while connecting database");
  }
};
