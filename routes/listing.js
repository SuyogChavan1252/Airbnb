const express = require("express");
const router = express.Router(); //router obj banavlay
const Listing = require("../models/listing.js"); //import kelay
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
//multer
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index)) //index
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.saveroute)
  ); //create or post by submit form

//new route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderform));

router
  .route("/:id")
  .get(wrapAsync(listingController.showroute)) //show route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateform) //update route
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyroute) //delete route
  );

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.rendereditform) //edit route
);

module.exports = router;
