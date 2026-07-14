const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config({ path: "../.env" });

const mongoose =require("mongoose");
const initdata=require("./data.js")
const Listing=require("../models/listing.js");
const { cloudinary } = require("../cloudConfig");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapAccessToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({
    accessToken: mapAccessToken
});

async function main(){
   await mongoose.connect(process.env.CLOUD_DATABASE_URL);
}

main()
  .then(async () => {
    console.log("Connected to DB!");
    try {
      await initDB();
    } catch (err) {
      console.error("INIT DB ERROR:", err);
    }
  })
  .catch((err) => {
    console.error(err);
  });
const initDB = async () => {
    await Listing.deleteMany({});
    
    let listings = initdata.data.map((obj) => ({
        ...obj,
        owner: "6a2fbdf1d786ce1e3008396d",
        
        
    }));

    
    for (let listing of listings) {
        console.log("Uploading:", listing.title);

        const result = await cloudinary.uploader.upload(
            listing.image.url,
            {
                folder: "wanderlust_DEV",
            }
        );
        console.log("Uploaded:", listing.title);
        listing.image = {
            url: result.secure_url,
            filename: result.public_id,
        };
        const geoData = await geocodingClient
            .forwardGeocode({
                query: `${listing.location}, ${listing.country}`,
                limit: 1,
            })
            .send();
            console.log("Geocoded:", listing.title);
            listing.geometry = geoData.body.features[0].geometry;
    }

    
    await Listing.insertMany(listings);
    console.log("Inserted successfully!");
    
};


 


