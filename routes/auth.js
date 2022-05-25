// initialize express router
const router = require("express").Router();

// import userSchema
const User = require("../models/User");

// initialize cryptoJS for Hashing password
const CryptoJS = require("crypto-js");

// initialize jwt
const jwt = require("jsonwebtoken");

// Register User
router.post("/register", async (req, res) => {
  // create newUser
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    // search for user in DB
    const user = await User.findOne({
      username: req.body.username,
    });
    if (!user) {
      return res.status(401).json("Wrong Credentials");
    }

    // get Password and hash it
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    const inputtedPassword = req.body.password;
    if (originalPassword !== inputtedPassword) {
      return res.status(401).json("Wrong Password");
    } else {
      // if login is successful assign jwt to user
      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      );

      // deconstruct password from returned values
      const { password, ...others } = user._doc;

      // return user info except for password along with assigned token
      res.status(200).json({ ...others, accessToken });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
