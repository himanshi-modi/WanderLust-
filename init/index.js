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
   await mongoose.connect('mongodb://MERNUSER:Mern12345@ac-afsbq6p-shard-00-00.afxjaa6.mongodb.net:27017,ac-afsbq6p-shard-00-01.afxjaa6.mongodb.net:27017,ac-afsbq6p-shard-00-02.afxjaa6.mongodb.net:27017/test?ssl=true&replicaSet=atlas-2xezdt-shard-0&authSource=admin&appName=Cluster0');
}

main()
    .then(async () => {
        console.log("Connected to DB!");
        await initDB();
    })
    .catch((err) => {
        console.log(err);
    });

const initDB = async () => {
    await Listing.deleteMany({});

    let listings = initdata.data.map((obj) => ({
        ...obj,
        owner: "6a2fbdf1d786ce1e3008396d",
        
        
    }));

    
    for (let listing of listings) {
       
        const result = await cloudinary.uploader.upload(
            listing.image.url,
            {
                folder: "wanderlust_DEV",
            }
        );
        
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

            listing.geometry = geoData.body.features[0].geometry;
    }

    
    await Listing.insertMany(listings);
    console.log("Inserted successfully!");
    
};


 


