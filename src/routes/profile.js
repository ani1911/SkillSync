const express = require("express");
const { userAuth } = require("../middlewares/auth");
const router = express.Router();
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      return res.status(400).json({ message: "Invalid update fields" });
    }

    const user = req.user;

    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));

    await user.save();
    res.send({
      message: "Profile updated successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

router.patch("/profile/updatepassword", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    const isvalid = await user.validatePassword(currentPassword);

    if (!isvalid) {
      throw new Error("current Password is invalid");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    user.password = passwordHash;
    await user.save();

    res.send("password updated successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = router;
