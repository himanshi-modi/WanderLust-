const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
const WrapAsync = require("../utils/WrapAsync");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/reviews.js");
const ExpressError = require("../utils/ExpressError");
const {validateReview} = require("../middleware.js");
const {isLoggedIn,isReviewAuthor} = require("../middleware.js");



const reviewsController=require("../controllers/reviews.js")

router.post("/",isLoggedIn,validateReview, WrapAsync(reviewsController.createReview));
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,WrapAsync(reviewsController.deleteReview));

module.exports=router;