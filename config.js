require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  secretKey: process.env.SECRET,
};

module.exports = config;
