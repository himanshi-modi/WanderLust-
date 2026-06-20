const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const WrapAsync = require("../utils/WrapAsync");
const { listingSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});

//all listing
router.route("/")
.get(WrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,WrapAsync(listingController.createListing));


//get new form
router.get("/new",isLoggedIn,WrapAsync(listingController.renderNewForm));


router.route("/:id")
.get(isLoggedIn,WrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,WrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,listingController.deleteListing);

//edit form
router.get("/:id/edit", isLoggedIn,isOwner,WrapAsync(listingController.editForm));
    



module.exports=router;