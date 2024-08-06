const User=require("../models/user");
module.exports.signup=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      let registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      //for automatic login after signup use this
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
      });
    } catch (e) {
      //an sigle error here can be that user already exists as this functionality is provided by passport tool
      req.flash("error", "A user with  this username already exists");
      res.redirect("/signup");
    }
  }

  module.exports.renderLoginForm=(req, res) => {
    res.render("users/login.ejs");
  }

  module.exports.login=async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings";   //jr res.locals.redirectUrl madhe jr res.locals.redirectUrl save krr nahitr nasel tr "/listings "
    res.redirect(redirectUrl);   //yat apan orignalUrl save keli ahe
  }

  module.exports.logout= (req, res, next) => {
    req.logOut((err) => {
      if (err) {
        //if error is present
        return next(err);
      }
      req.flash("success", "You are logged out successfully"); //
      res.redirect("/listings");
    });
  }