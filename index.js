// create express server
const express = require("express");
const app = express();

// initialize dotenv
const dotenv = require("dotenv");
// import routes
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe")

// initialize cors
const cors = require("cors")

// Loads .env file contents into process.env
dotenv.config();

// create mondoDB server
const mongoose = require("mongoose");

// connect mongoDb to server
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => {
    console.log(err);
  });

// allow server use json formats
app.use(express.json());

// prevent cors policy error when making backend request.
app.use(cors());
//connect routes to server
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute)

// listen on port 5000
app.listen(process.env.PORT || 5000, () => {
  console.log("server is running");
});
