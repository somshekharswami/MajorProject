const express=require("express");
const router=express.Router({mergeParams:true});
const { listingSchema,reviewSchema }= require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
      let errMsg= error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
  
    }else{
      next();
    }
  };
  


//review route
router.post("/", validateReview, async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview = new Review({
     Comment: req.body.review.comment,  // Make sure you're accessing 'Comment'
     rating: req.body.review.rating
   });
   
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
   
    console.log("new Review saved");
   //  res.send("new Review saved ")
    res.redirect(`/listings/${listing._id}`)
   });
   module.exports=router;