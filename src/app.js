const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  // create the instance of the user model

  const user = new User({
    firstName: "Sanket",
    lastName: "Shelke",
    emailId: "sanket@gmail.com",
    password: "sanket@123",
  });

  try {
    await user.save();
    res.send("User Added successfully");
  } catch (err) {
    res.status(400).send("user data not saving:", err);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established..");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected!!");
  });
