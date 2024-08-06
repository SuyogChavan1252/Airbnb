const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get((req, res) => {
    res.render("users/signup.ejs");
  })
  .post(wrapAsync(userController.signup));

//now for login
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl, //middleware call kela original path save karayla
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true
    }),
    wrapAsync(userController.login)
  );

//now for logout
router.get("/logout", userController.logout);

module.exports = router;
