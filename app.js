//TO USE .env
if (process.env.NODE_ENV != "production") {
    require("dotenv").config(); // Load environment variables in development
}

// console.log(process.env);

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const flash=require("connect-flash");
const Listing=require("./models/listing.js"); //import kelay
const Review=require("./models/review.js");
const User=require("./models/user.js");
const passport=require("passport");
const LocalStratergy=require("passport-local"); //above two for passport include
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapasync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

const listingRouter=require("./routes/listing.js"); //include kela 
const reviewRouter=require("./routes/review.js"); //include kela 
const userRouter=require("./routes/user.js"); //include kela 


const session=require("express-session");
const MongoStore=require("connect-mongo");
let dbUrl=process.env.ATLAS_DB_URL;   //mongoatlas chi link ji .env madhe ahe
async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
await mongoose.connect(dbUrl);
}
main()   //checks whethe db is connected
.then(()=>{
    console.log("Connected to DB");
})
.catch(err => console.log(err));

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600, //sec madhe mnje kiti sec ni update zala pahije session
       
})
store.on("error",()=>{
    console.log("Error is",err);
})
const sessionoptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*34*60*60*1000,
        maxage:7*34*60*60*1000,
        httpOnly:true
    }
}
app.use(session(sessionoptions));
app.use(flash());
//passport related
app.use(passport.initialize());
app.use(passport.session());//it should store info for entire session i.e interaction of user whether he switched from one tab to another
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //to store info of user for particular session
passport.deserializeUser(User.deserializeUser());


app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));



// app.get("/",(req,res)=>{
//     res.send("Hi i am root");
// })

//let us create middleware for using res.locals for flash
app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");  //successMsg mdhe save hoil tya chi value u can use successMsg directly without passing in templating in any ejs file
    res.locals.errorMsg=req.flash("error");
    res.locals.currUser=req.user;
    next();                                      //normal match krr routes bakiche
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"delta@gamai.com",
//         username:"delta-student"
//     })
//     let registeredUser= await User.register(fakeUser,"helloworld");    //register is default method by passport and helloworld is passord
//     res.send(registeredUser)
// })

// saglya listing cha aivaji fakt ek line
app.use("/listings",listingRouter);  // /listings pasun common start honare listings mnje listing.js madla route shi match kara

//saglya reviews cha aivaji faks
app.use("/listings/:id/reviews",reviewRouter);  // /listings/:id/reviews pasun common start honare listings mnje listing.js madla route shi match kara
//ha :id tikde mnje review.js madhe routes folder cha tevhach use karayla yeil javha tumi mergeparams :true lihel tya file madhe
app.use("/",userRouter);

app.all("*",(req,res,next)=>{           // if route doesn't match with above all routes then it weill come here
    next(new ExpressError(404,"Page Not Found !"));
})

// error handler middleware  //warcha error ita fekla gela
//this middleware works for both for custom and also for express default error handler
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong"}=err; //we have also assigned default values
    res.status(statusCode).render("error.ejs",{message});
})
app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
})