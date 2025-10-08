const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ firstname: "Aniket", lastname: "Shelke" });
});

app.post("/user", (req, res) => {
  res.send("Data is saved successfully");
});

app.use("/test", (req, res) => {
  res.send("hello from the test");
});

app.delete("/user", (req, res) => {
  res.send("data is deleted");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000...");
});
