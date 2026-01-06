const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }
};

const validateEditProfileData = (req) => {
  const ALLOWED_UPDATES = ["about", "skills", "age", "gender", "photourl"];

  const isValidUpdate = Object.keys(req.body).every((key) =>
    ALLOWED_UPDATES.includes(key)
  );

  return isValidUpdate;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
