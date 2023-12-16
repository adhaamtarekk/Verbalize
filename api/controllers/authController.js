const User = require("../models/User.js");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

//LOGIN User
const login = async (req, res) => {
  try {
    if (!req.body.username) {
      throw new Error("Please enter a username");
    }
    if (!req.body.password) {
      throw new Error("Please enter a password");
    }
    userExists = await User.findOne({ username: req.body.username });

    if (!userExists) {
      throw new Error("this username does not exist");
    }

    if (!bcrypt.compare(req.body.password, userExists.password)) {
      throw new Error("Invalid password");
    }
    const token = createToken(userExists._id);

    res
      .status(200)
      .json({ username: userExists.username, token, id: userExists._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error.message);
  }
};

//REGISTER New User
const register = async (req, res) => {
  if (!req.body.username) {
    throw new Error("Please enter a username");
  }
  if (!req.body.password) {
    throw new Error("Please enter a password");
  }
  if (!validator.isEmail(req.body.email)) {
    throw Error("Please enter a valid email");
  }
  // if (!validator.isStrongPassword(req.body.password)) {
  //   throw new Error("Please enter a valid password");
  // }

  if (await User.findOne({ email: req.body.email })) {
    throw new Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });
    const savedUser = await newUser.save();
    const token = createToken(savedUser._id);
    res.status(200).send({ savedUser, token });
  } catch (err) {
    console.error(err);
  }
};
module.exports = { register, login };
