const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initializeDatabase = async () => {
  try {
    await mongoose.connect(mongoUri).then(() => {
      console.log("Connected to database");
    });
  } catch (error) {
    console.log("An error occured while connecting data", error);
  }
};
module.exports = { initializeDatabase };
