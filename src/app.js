const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send("Request body cannot be empty");
    }

    const user = new User(req.body);
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send("Email already exists");
    }
    res.status(400).send(err.message);
  }
});

// get user my emailID
app.get("/user", async (req, res) => {
  const useremailID = req.body.emailId;

  try {
    const users = await User.find({ emailId: useremailID });
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

// Feed api /get feed - get the all users from the database

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

// delete user from database

app.delete("/user/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("delete user succesfully");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

// update user by id
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  try {
    if (Object.keys(data).length == 0) {
      return res.status(400).send("NO data provided for update");
    }
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("update not allowed");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });
    res.send(user);
  } catch (err) {
    res.status(400).send("UPDATE FALIED: " + err.message);
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
