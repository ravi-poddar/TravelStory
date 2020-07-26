var express      = require("express"),
    router       = express.Router(),
    Story        = require("../models/story"),
    Comment      = require("../models/comment"),
    middleware   = require("../middleware");

//INDEX- show all stories.
router.get("/", function(req,res){
    Story.find({},function(err,allStories){
        if(err){
            console.log(err);
        }else{
            res.render("stories/index",{stories: allStories});
        }
    });
    
});

// //CREATE-add new story
router.post("/",middleware.isLoggedIn,function(req,res){
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var data = {
        name: req.body.name,
        country:req.body.country,
        image: req.body.image,
        description:req.body.description,
        author: author
    } 
    Story.create(data,function(err,story){
        if(err){
            console.log(err);

        }else{
            console.log(story);
            res.redirect("/stories");
        }
    });
});

// //NEW-show form to create a new story.
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("stories/new");
});

//SHOW- show more info about one campground.
router.get("/:id",function(req,res){
    Story.findById(req.params.id).populate("comments").exec(
        function(err,foundStory){
            if(err || !foundStory){
                console.log(err);
                req.flash("error","Story not found");
                res.redirect("back");
            }else{
                res.render("stories/show",{story:foundStory});
            }
    });
});

//Edit Story 
router.get("/:id/edit",middleware.checkStoryOwnership,function(req,res){
    Story.findById(req.params.id,function(err,foundStory){
        if(err){
            res.redirect("back");
        }else{
            res.render("stories/edit",{story:foundStory});
        }
    }); 
});

//Update Story
router.put("/:id",middleware.checkStoryOwnership,function(req,res){
   Story.findByIdAndUpdate(req.params.id,req.body.story,function(err,updatedStory){
        if(err){
            console.log(err);
        }else{
            req.flash("success","Successfully updatd story");
            res.redirect("/stories/"+req.params.id);
        }
    });
});

//Destroy Story
router.delete("/:id",middleware.checkStoryOwnership,function(req,res){
    Story.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/stories");
        }
    });
});

module.exports = router;