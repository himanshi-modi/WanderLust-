const mongoose=require("mongoose");


const Schema = mongoose.Schema;  
const Review=require("./reviews.js");
const { required } = require("joi");

const listingSchema=new mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    description:{
        type:String 
    },
    image: {
      url:String,
      filename:String,
    },
    price:{
        type:Number

    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review"
      }
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User"
    },
    geometry:{
      type:{
        type:String,
        enum:['Point'],
        required:true
      },
      coordinates:{
        type:[Number],
        required:true
      }
    },
     category: {
        type: String,
        enum: [
            "Trending",
            "Farms",
            "Rooms",
            "Amazing Views",
            "Iconic Cities",
            "Surfing",
            "Beaches",
            "Arctic",
            "Tree House",
            "Camping",
            "House Boat"
        ],
        default: "Trending"
    }
});
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    let res=await Review.deleteMany({_id:{$in:listing.reviews}});
    console.log(res);
  }
})

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;