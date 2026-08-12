const jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET,{
    expiresIn: "30d",
});

  res.cookie("token", token, {
    httpOnly: true,
  secure: process.env.NODE_ENV === "production", // production mein HTTPS zaroori
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // cross-domain ke liye zaroori
  maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  return token;
};

module.exports = generateToken;
