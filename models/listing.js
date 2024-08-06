const mongoose = require("mongoose");
const Schema = mongoose.Schema; //mnje sarkhs mongoose.Schema nahi lihayla lagnr just Schema enough
const Review=require("./review.js");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,

  image: {
   url:String,
   filename:String
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  }
});
//now let us create post middleware i.e as we delte any listing all reviews associated should get delete
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
   await Review.deleteMany({_id:{$in:listing.reviews}});  //mnje  listing.reviews array mdhe jevde pn id match hotayt tya saglya delte krr Review collection madun
  }
})







//create model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing; //export this model or collection to app.js

