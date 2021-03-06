const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// initialize express router
const router = require("express").Router();

// GET SINGLE USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;

    if (user) {
      res.status(200).json(others);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;

  try {
    // if query and query is new=true, return the latest five users

    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();

    if (users) {
      res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE USER
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        // set new values
        $set: req.body,
      },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE USER
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User deleted...");
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    if (data) {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
