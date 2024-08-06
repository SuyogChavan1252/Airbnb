const Listing=require("../models/listing");
const Review=require("../models/review");
module.exports.createReview=async(req,res)=>{
    let listing= await Listing.findById(req.params.id);   //Listing is collection    (ithe id tevhach access hoil jevha mergeparams:true asel)
    let newReview=new Review(req.body.review)  //review is object like Listing we write for name=review[comment] like this in form
    listing.reviews.push(newReview);
    newReview.author=req.user._id; //mnje jo logged in ahe tyala authour
    await newReview.save();
    await listing.save();
    req.flash("success","New Review created");
    res.redirect(`/listings/${listing._id}`);
    }

    module.exports.destroyReview=async(req,res)=>{
        let {id,reviewId}=req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});  //update such that tya listing cha reviews array madhe je pn reviewId la match hoil te remove kr
        await Review.findByIdAndDelete(id);
        req.flash("success"," Review deleted");
        res.redirect(`/listings/${id}`);
        }