if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}
console.log(process.env.SECRET);
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const passport=require("passport");
const LocalStratergy=require("passport-local").Strategy;
const User=require("./models/user.js");
const userRouter=require("./routes/userRouter.js");

const path=require("path");
app.use(express.urlencoded({extended:true}));
const ejsMate = require("ejs-mate");
const listings=require("./routes/listing.js");
const reviews=require("./routes/reviews.js");
const session=require("express-session");
const MongoStore = require('connect-mongo').default;
console.log(MongoStore);
const flash=require("connect-flash");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"public")));

const dbUrl=process.env.CLOUD_DATABASE_URL;




const WrapAsync=require("./utils/WrapAsync.js");
const ExpressError=require("./utils/ExpressError");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const methodOverride=require("method-override");
app.use(methodOverride("_method"));

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
    

})

store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE" ,err);
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
    }
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
     res.locals.search = req.query.search || "";
    next();
});
app.use("/",userRouter);
app.use("/listings/:id/reviews",reviews);
app.use("/listings",listings);
app.use((req, res, next) => {
    res.locals.search = req.query.search || "";
    next();
});
app.get("/demouser",async(req,res)=>{
    let fakeUser=new User({
        email:"himanshi@gmail.com",
        username:"himanshi"
    });
    let registeredUser=await User.register(fakeUser,"helloWorld");
    res.send(registeredUser);
})

app.engine("ejs",ejsMate);
async function main(){
    await mongoose.connect('mongodb://MERNUSER:Mern12345@ac-afsbq6p-shard-00-00.afxjaa6.mongodb.net:27017,ac-afsbq6p-shard-00-01.afxjaa6.mongodb.net:27017,ac-afsbq6p-shard-00-02.afxjaa6.mongodb.net:27017/test?ssl=true&replicaSet=atlas-2xezdt-shard-0&authSource=admin&appName=Cluster0');
}
main().then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
});

app.listen(8080,()=>{
    console.log("App is listening!");
});


app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//error handler
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.render("error.ejs",{message});
})