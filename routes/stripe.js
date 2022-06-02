const router = require("express").Router();

// initialize stripe
const stripe = require("stripe")(process.env.STRIPE_KEY);

// PAYMENT
router.post("/payment", (req, res) => {
    // create payment object
  stripe.charges.create({
    source: req.body.tokenId,
    amount: req.body.amount,
    currency: "cad",
  }, (stripeError, stripeResponse) => {
      if (stripeError){
          res.status(500).json(stripeError)
      }else {
          res.status(200).json(stripeResponse)
      }
  });
});

module.exports = router;
