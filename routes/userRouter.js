const express=require("express");
const WrapAsync = require("../utils/WrapAsync");
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport");
const { saveRedirectedUrl } = require("../middleware.js");
const userController= require("../controllers/users.js");

//signup Form
router.route("/signup")
.get(userController.signupForm)
.post( WrapAsync(userController.signup));

//loginForm
router.route("/login")
.get( userController.loginForm)
.post(saveRedirectedUrl, passport.authenticate("local",{
    failureRedirect:"/login", 
    failureFlash:true
    }),userController.login);



//logout
router.get("/logout", userController.logout);
module.exports=router;