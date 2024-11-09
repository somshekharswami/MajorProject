const express=require("express");
const app=express();
const session=require("express-session");
const flash=require("connect-flash");

const SessionOptions={
    secret:"mysecretusuperstring", 
    resave:false, 
    saveUninitialized :true,
};

app.use(session(SessionOptions));
app.use(flash());

app.get("/test",(req,res)=>{
    let{name="anonymous"}=req.query;
    req.session.name=name;
    res.redirect(`/hello`);
})
app.get("/hello",(req,res)=>{
    res.send(`hello${req.session.name}`)
})

app.listen(3000,()=>{
    console.log(`Listening to port 3000`);
})