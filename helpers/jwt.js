var jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

function encodeToken(params) {
  return jwt.sign(params, JWT_SECRET_KEY);
}

function decodeToken(token) {
  return jwt.verify(token, JWT_SECRET_KEY);
}

module.exports = { encodeToken, decodeToken };
