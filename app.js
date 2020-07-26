// NPM packages
const   express                 = require('express'),
        bodyParser              = require("body-parser"),
        flash                   = require("express-flash"),
        methodOverride          = require("method-override"),
        mongoose                = require("mongoose"),
        passport                = require("passport"),
        LocalStrategy           = require("passport-local"),
        Story                   = require("./models/story"),
        User                    = require("./models/user"),
        Comment                 = require("./models/comment");

// Express app
const app = express();

//Importing Routes
const   storyRoutes      = require("./routes/stories"),
        commentRoutes    = require("./routes/comments"),
        indexRoutes      = require("./routes/index");

// Mongoose Setup
mongoose.set('useFindAndModify',false);
mongoose.connect('mongodb://localhost/travelApp',{useNewUrlParser:true, useUnifiedTopology:true});


// Passport Configuration
app.use(require("express-session")({
    secret: "Travelling is fun",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global Variables
app.use(flash());
app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.error= req.flash("error");
    res.locals.success= req.flash("success");
    next();
});

// App Setup
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

// Routes
app.use("/stories",storyRoutes);
app.use("/stories/:id/comments",commentRoutes);
app.use("/",indexRoutes);

app.get('*',(req,res)=>{
    res.redirect('/');
});

app.listen('3000',()=>{
    console.log('Travel Story App Started');
});