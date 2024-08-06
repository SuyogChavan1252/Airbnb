const express = require("express");
const router = express.Router({ mergeParams: true }); //router obj banavlay mergeparams kela karan app.js madla params pn ita use karayla yava
const Listing = require("../models/listing.js"); //import kelay
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor
} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
//Reviews

//post route  itha isLoggedIn karan direct hoppscoth ni karu naye review post
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);
module.exports = router;
