if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate=require("ejs-mate"); 
const multer=require("multer");
const upload=multer({dest:"uploads/"});

const listing=require("./routes/listing.js");
const Review=require("./routes/review.js");
const user=require("./routes/users.js");

const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const dbUrl=process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });


async function main() {
  await mongoose.connect(dbUrl);
}


const store=MongoStore.create({

  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("Error in Mongo Session Store",err);
})

const SessionOptions={
  store,
 secret:process.env.SECRET,
 resave:false,
 saveUninitialized:true,
 cookie:{
  expires:Date.now()+7 * 24 * 60 * 60 *1000,
  maxAge:7 * 24 * 60 * 60 *1000,
 }
}


app.use(session(SessionOptions));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.sucess=req.flash("sucess");
  res.locals.error = req.flash("error");
  res.locals.currUser=req.user;
  next();
})

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));




app.use("/listings",listing);
app.use("/listings/:id/reviews",Review);
app.use("/",user);


app.use((err,req,res,next)=>{
res.send("something went wrong!")
});
app.listen(8080, () => {
  console.log("server is listening to port 8080");
}); 