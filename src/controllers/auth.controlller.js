require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
};

const register = async (req, res) => {
  try {
    // Check if the user already exists with the provided email
    let user = await User.findOne({ email: req.body.email }).lean().exec();

    if (user) {
      return res.status(400).send({ message: "Please try another email" });
    }

    // Create a new user with the provided email and password
    user = await User.create(req.body);

    // Generate a token for the user
    const token = generateToken(user);

    // Associate the token with the user in your database (e.g., by storing it in a field)
    user.token = token;
    await user.save();

    // Return the user and the token
    res.send({ user, token });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const login = async (req, res) => {
  try {
    // Find the user with the provided email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send({ message: "Please try another email or password" });
    }

    // Check if the provided password matches the user's password
    const match = await user.checkPassword(req.body.password);

    if (!match) {
      return res.status(400).send({ message: "Please try another email or password" });
    }

    // Generate a token for the user
    const token = generateToken(user);

    // Return the user and the token
    res.send({ user, token });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { register, login };
