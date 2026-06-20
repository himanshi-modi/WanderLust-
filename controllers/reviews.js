const Listing = require("../models/listing");
const Review=require("../models/reviews.js");

module.exports.createReview=async (req, res) => {
   
    
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return res.status(404).send("Listing not found!");
    }

    const newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    await newReview.save();
    console.log(newReview);
    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash("success","Review Added");
    
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview=async(req,res)=>{
    
    let {id,reviewId}=req.params;
    let review=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});   
    let review1=await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};