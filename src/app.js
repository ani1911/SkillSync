const express = require("express");
const app = express();

app.use("/user", (req, res, next) => {
  console.log("Handling the request");
  // res.send("response");
  next();
});

app.use("/user", (req, res, next) => {
  console.log("Handling the request");
  res.send("response2");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000...");
});
