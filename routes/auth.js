const express = require("express");
const router = express.Router();
const csrf = require("csurf");
var passport = require("passport");
const Cart = require("../models/cart");
const User = require("../models/user");
const Token = require("../models/token");
const middleware = require("../middleware");
const crypto = require('crypto')
const {
  userSignUpValidationRules,
  userSignInValidationRules,
  validateSignup,
  validateSignin,
  validateResetPassword,
  resetPasswordValidationRules,
  validateResetPassword2,
  resetPasswordValidationRules2
} = require("../config/validator");
const sendEmail = require("../config/sendEmail");
const csrfProtection = csrf();
router.use(csrfProtection);

// GET: display the signup form with csrf token
router.get("/signup", middleware.isNotLoggedIn, (req, res) => {
  var errorMsg = req.flash("error")[0];
  res.render("user/signup", {
    csrfToken: req.csrfToken(),
    errorMsg,
    pageName: "Sign Up",
  });
});
// POST: handle the signup logic
router.post(
  "/signup",
  [
    middleware.isNotLoggedIn,
    userSignUpValidationRules(),
    validateSignup,
    passport.authenticate("local.signup", {
      successRedirect: "/user/profile",
      failureRedirect: "/auth/signup",
      failureFlash: true,
    }),
  ],
  async (req, res) => {
    try {
      //if there is cart session, save it to the user's cart in db
      if (req.session.cart) {
        const cart = await new Cart(req.session.cart);
        cart.user = req.user._id;
        await cart.save();
      }
      // redirect to the previous URL
      if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
      } else {
        res.redirect("/user/profile");
      }
    } catch (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("/");
    }
  }
);

// GET: display the signin form with csrf token
router.get("/signin", middleware.isNotLoggedIn, async (req, res) => {
  var errorMsg = req.flash("error")[0];
  res.render("user/signin", {
    csrfToken: req.csrfToken(),
    errorMsg,
    pageName: "Sign In",
  });
});

// POST: handle the signin logic
router.post(
  "/signin",
  [
    middleware.isNotLoggedIn,
    userSignInValidationRules(),
    validateSignin,
    passport.authenticate("local.signin", {
      failureRedirect: "/auth/signin",
      failureFlash: true,
    }),
  ],
  async (req, res) => {
    try {
      // cart logic when the user logs in
      let cart = await Cart.findOne({ user: req.user._id });
      // if there is a cart session and user has no cart, save it to the user's cart in db
      if (req.session.cart && !cart) {
        const cart = await new Cart(req.session.cart);
        cart.user = req.user._id;
        await cart.save();
      }
      // if user has a cart in db, load it to session
      if (cart) {
        req.session.cart = cart;
      }
      // redirect to old URL before signing in
      if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
      } else {
        res.redirect("/user/profile");
      }
    } catch (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("/");
    }
  }
);

// Get: dislay forget passwort
router.get("/forgot-password", middleware.isNotLoggedIn, async (req, res) => {
  var errorMsg = req.flash("error")[0];
  var successMsg = req.flash("success")[0];

  res.render("user/forget-password", {
    csrfToken: req.csrfToken(),
    errorMsg,
    successMsg,
    pageName: "Forgot password",
  })
});

router.post("/forgot-password", [
  middleware.isNotLoggedIn,
  resetPasswordValidationRules(),
  validateResetPassword,
], async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user){      
      req.flash('error', "email doesn't exist");
      return res.redirect('/auth/forgot-password')
  }

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }
    // 'http://' + req.headers.host + '/reset/' + token + '\n\n' +
    const link = `${process.env.BASE_URL}user/password-reset/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password reset", link,req,res);

    req.flash('success',"password reset link sent to your email account");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
});

router.get('/password-reset/:userId/:token', async function(req, res) {
  await Token.findOne({userId: req.params.userId,
    token: req.params.token,}, function(err, token) {
    if (!token) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/auth/signin');
    }
    var errorMsg = req.flash("error")[0];
    var successMsg = req.flash("success")[0];

    res.render('user/reset', {
      errorMsg ,successMsg,
      pageName: "reset",
      csrfToken: req.csrfToken(),

    });
  });
});


router.post("/password-reset/:userId/:token", [
  middleware.isNotLoggedIn,
  // resetPasswordValidationRules2(),
  // validateResetPassword2,
], async (req, res) => {
  try {
    
    const user = await User.findById(req.params.userId);
    if (!user){
      req.flash('error',"invalid link or expired");
      return res.redirect('/auth/signin') ;
  }
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token){
      req.flash('error',"Invalid link or expired");
      return res.redirect('/auth/signin') };
    prepassword = req.body.password;  
    user.password = user.encryptPassword(prepassword)
    await user.save();
    await token.delete();

    req.flash('success',"password reset sucessfully.");
    res.redirect('/auth/successPassword') ;

  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
});

router.get('/successPassword',middleware.isNotLoggedIn, (req,res)=>{
  res.render('user/successPassword',{
      pageName: "Successful",
  })
})

router.get('/facebook',
  passport.authenticate('facebook'));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/signin' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/user/profile');
  });

module.exports = router;
