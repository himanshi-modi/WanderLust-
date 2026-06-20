const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapAccessToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapAccessToken });

//allListings
module.exports.index=async(req,res)=>{
    console.log("QUERY:", req.query);
    const { category,search} = req.query;
    let query={};
    

    if (category) {
        query.category=category;
    } 
    if(search){
        query.$or=[
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } }
        ];
    };
     console.log("MONGO QUERY:", query);
    const allListings = await Listing.find(query);
     console.log("RESULTS:", allListings.length);
    res.render("listings/index.ejs", {
        allListings,
        selectedCategory: category,
        search
    });

};

//form for creating Listing
module.exports.renderNewForm=async(req,res)=>{
    res.render("./listings/form.ejs");
};

//show Listing
module.exports.showListing=async (req,res,next)=>{
        let { id } = req.params;

    let listing = await Listing.findById(id)
        .populate("owner")
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        });
        // console.log("Geometry:", listing.geometry);

        if (!listing) {
            req.flash("error", "Listing doesn't exist!");
            return res.redirect("/listings");
        }

    res.render("./listings/show.ejs", { listing });
        
}

//add new Listing
module.exports.createListing=async (req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
    })
  .send()
        
        let url=req.file.path;
        let filename=req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner=req.user._id;
        newListing.image = {url ,filename};
        newListing.geometry=response.body.features[0].geometry;
        let savedListing=await newListing.save();
        console.log(savedListing);
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
        
    };

//editForm
module.exports.editForm=async (req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("./listings/editform.ejs",{listing,originalImageUrl});
};

//Update Listing
module.exports.updateListing=async (req,res)=>{
    
    let{id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{... req.body.listing});
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
    };

//Delete Listing
module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");

};



