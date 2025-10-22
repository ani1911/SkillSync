const mongoose = require("mongoose");

const connectDB = async () => {
  return mongoose.connect(
    "mongodb+srv://aniketshelke_db_user:Aniket%401234@skillsync-cluster.vsficza.mongodb.net/SkillSync"
  );
};

module.exports = connectDB;
