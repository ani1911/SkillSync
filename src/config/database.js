const mongoose = require("mongoose");

const connectDB = async () => {
  return mongoose.connect("mongodb://127.0.0.1:27017/skillsync");
};

module.exports = connectDB;