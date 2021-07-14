const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const verifyJwt = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
};

module.exports = asyncHandler(async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    const token = authorizationHeader.split(" ")[1];
    req.user = await verifyJwt(token);
  } catch (err) {
    throw { message: "Unauthorized", status: 401 };
  }

  next();
});
