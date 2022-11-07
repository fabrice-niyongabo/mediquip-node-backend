const jwt = require("jsonwebtoken");

const randomNumber = () => {
  const max = 99999;
  const min = 11111;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
  randomNumber,
};
