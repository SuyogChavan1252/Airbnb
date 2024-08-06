//THis middleware is for that  ki if you are accessing anything before login look listing.js
const Listing=require("./models/listing");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review = require("./models/review.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){        //passport method sees wheteher user is login or not jr nahi login tr
        req.session.redirectUrl=req.originalUrl;  //originalUrl mnje jitha access kart hota user
        req.flash("error","You must login to Create listing"); 
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){ 
        res.locals.redirectUrl=req.session.redirectUrl;        //karan login kelyvr req.sesion reset hota tyamule locals la save kealy apan
    }
    next();
}
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
     req.flash("error","Only Owner can make changes");
     return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports. validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);  //req keleli listingSchema servers side validation ani tyatla error extract kela
    // console.log(error);
    if(error){     //jr result madhe error sapadla tr
        let errMsg=error.details.map((el)=>el.message).join(","); //details arr ahe ani tyat multiple object mg pratek obj mnje element returs their message and all messages joined by ,
      throw new ExpressError("400",errMsg);
    }
    else{
        next();  //if no error
    }
}

 module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);  //req keleli listingSchema servers side validation ani tyatla error extract kela
    // console.log(error);
    if(error){     //jr result madhe error sapadla tr
        let errMsg=error.details.map((el)=>el.message).join(","); //details arr ahe ani tyat multiple object mg pratek obj mnje element returs their message and all messages joined by ,
      throw new ExpressError("400",errMsg);
    }

    next();  //if no error
    
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    try{
        let {id,reviewId}=req.params;
        let review=await Review.findById(reviewId);
        if(!review.author.equals(res.locals.currUser._id)){
         req.flash("error","You are not author of this review");
         return res.redirect(`/listings/${id}`);
        }
        next();
    }
    catch(e){
        next(e);  //pass to next error handling middleware
    }
   
}