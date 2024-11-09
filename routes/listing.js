
const express=require("express");
const router=express.Router();
const { listingSchema,reviewSchema }= require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn}=require("../views/middlewares/loggedin.js")
const multer=require("multer");
const {storage}=require("../cloudConfig.js")
const upload=multer({storage});
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});



const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
      let errMsg= error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
  
    }else{
      next();
    }
  }


//Index Route
router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  });
  
  //New Route
  router.get("/new",isLoggedIn, (req, res) => {
        res.render("listings/new.ejs");
  });
  
  //Show Route
  router.get("/:id",isLoggedIn, async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  });
  
  //Create Route
  router.post("/",
    isLoggedIn,
   
    upload.single('listing[image]'),
    validateListing,
    async (req, res,next) => {
    try{

    let response=  await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();
      
      
      let url=req.file.path;
      let filename=req.file.filename;
   
    const newListing = new Listing(req.body.listing);
    newListing.image={url,filename};
    newListing.geometry= response.body.features[0].geometry ;

    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("sucess","New Listing Created!")
    res.redirect("/listings");
 
   

    }catch(err){
      next(err);
    }
  });
  
  //Edit Route
  router.get("/:id/edit", 
    isLoggedIn,
    async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  });
  
  //Update Route
  router.put("/:id", 
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    async (req, res) => {
     
      let { id } = req.params;
      let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
if(typeof req.file!= "undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
    }
    res.redirect(`/listings/${id}`);
  });
  
  //Delete Route
  router.delete("/:id", 
    isLoggedIn,
    async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  });
  module.exports=router;