const express = require("express");
const cors = require('cors');
const connect = require("./configs/db");
const app = express();
const userController = require("./controllers/user.controller");
const productController = require("./controllers/product.controller");
const { register, login, newToken } = require("./controllers/auth.controlller")

const passport = require("./configs/google.oauth");




app.use(cors());

app.use(express.json());

// /register
app.post("/register", register);
// .login
app.post("/login", login);

app.use("/users", userController);
app.use("/products", productController);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
  }),
  (req, res) => {
    const { user } = req;
    const token = newToken(user);

    return res.send({ user, token });
  }
);

app.listen(2754, async () => {
  try {
    await connect();
  } catch (err) {
    console.error(err.message);
  }
  console.log("listening on port 2754");
});
