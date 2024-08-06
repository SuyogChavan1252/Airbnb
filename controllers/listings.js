const Listing=require("../models/listing");
module.exports.index=async(req,res)=>{
    const alllistings=await Listing.find();  //alllistings is array jyat sagle documents stored ahet
    res.render("listings/index.ejs",{alllistings});
}
module.exports.renderform=(req,res)=>{    //isLoggedIn middleware vaparla ani jr te execute zala trch render honar form
    res.render("listings/createform.ejs");
}
module.exports.showroute=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");  //particular document milala .populate kela karay ref id cha aivaji purna document reveiw cha pn disude
    if(!listing){
        req.flash("error","Listing You are accessing is already deleted");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.saveroute=async(req,res,next)=>{
  let url=req.file.path;
  let filename=req.file.filename;
    // let{title,description,image,price,location,country}=req.body; or we have shortcut for this as look new.js we write in obj form input so syntax below follow
    let listing=req.body.listing; //apan creeateform.ejs madhe listing[title] mnje listing obj tayar kelay ani title tyachi  key asa; ani toh sarv data ata apan tayar kelay tya listing mdhe store
    // console.log(listing);    //req.body madhe listing navachi obj ahe ani tyat all data form cha store ahe 
    let newListing=new Listing(listing); //instance kela karan doc insert karaychay listing madhe data store ahe tyamula direct pass
    // console.log(newListing);
    newListing.owner=req.user._id; //curr_user chi id passport default save kart tich owner la de
    newListing.image={url,filename};
    await newListing.save();  //db madhe save krr
    req.flash("success","New listing created");  //flash create kela ani ha use /listings mnje index.ejs mdhe hoil 
    res.redirect("/listings");
    
    }

    module.exports.rendereditform=async(req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id);  //particular document mila
        if(!listing){
            req.flash("error","Listing You are accessing is already deleted");
            res.redirect("/listings");
        }
        let originalImageUrl=listing.image.url;
        originalImageUrl=originalImageUrl.replace("/upload","/upload/h_200,w_200")
        res.render("listings/editform.ejs",{listing,originalImageUrl});
    }

    module.exports.updateform=async(req,res)=>{
        let {id}=req.params;
        let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing}); //it reconstructs and updates individual parameters that are updated
       if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
       }
        req.flash("success"," listing updated");
        res.redirect(`/listings`);
    }

    module.exports.destroyroute=async(req,res)=>{
        let {id} =req.params;
       let deltedlisting= await Listing.findByIdAndDelete(id);    //after deleting post middleware which is inside listing.js
       req.flash("success"," listing deleted");
       res.redirect("/listings");
    }