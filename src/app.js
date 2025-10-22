const express = require("express");
const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");
app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
  res.send("user get data");
});

app.get("/admin/getdata", (req, res) => {
  res.send("data recieved");
});

app.get("/admin/deleteuser", (req, res) => {
  res.send("user is deleted");
});

app.get("/getdata", (req, res) => {
  try {
    throw new Error("dagadf");
    res.send("user sent data");
  } catch (err) {
    res.status(500).send("something went wrong..");
  }
});
app.use((err, req, res, next) => {
  if (err) {
    console.log("err");
    res.status(500).send("something went wrong..");
  }
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000...");
});
