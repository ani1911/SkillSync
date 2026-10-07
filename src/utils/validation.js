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
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "username",
    "about",
    "skills",
    "interests",
    "age",
    "gender",
    "photourl",
    "headline",
    "experienceLevel",
    "lookingFor",
    "availability",
    "githubUrl",
    "linkedinUrl",
    "portfolioUrl",
  ];

  const isValidUpdate = Object.keys(req.body).every((key) =>
    ALLOWED_UPDATES.includes(key)
  );

  return isValidUpdate;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
