// MongoDB/connectMongoDB.js
const mongoose = require('mongoose');

const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGO_URL;

    if (!uri) {
      console.error("❌ MongoDB connection failed: MONGO_URL not found in environment variables");
      process.exit(1);
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");

    // Optional: useful connection event listeners
    mongoose.connection.on("connected", () => {
      console.log("🟢 Mongoose is connected to the database");
    });

    mongoose.connection.on("error", (err) => {
      console.error("🔴 Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("🟠 Mongoose connection disconnected");
    });

  } catch (error) {
    console.error("❌ Error in connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectMongoDB;
