const   express     = require("express"),
        router      = express.Router(),
        User        = require("../models/user"),
        passport    = require("passport");

//Root Routes
router.get("/", (req, res)=>{
    res.render("landing");
});

//===================
//AUTH ROUTES
//===================

//show register form
router.get("/register",(req,res)=>{
    res.render("register");
});

//handle sign up logic
router.post("/register",(req,res)=>{
    var newUser=new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            req.flash("error",err.message); 
            res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to Travel Story "+ user.username);
            res.redirect("/stories");
        });
    });
});

//show login form
router.get("/login",(req,res)=>{
    res.render("login");
});

//handling login logic
router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/stories",
        failureRedirect:"/login"
    }),
    function(req,res){
});

//logic for logout route
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","Logged You Out!");
    res.redirect("/stories");
});

module.exports = router;