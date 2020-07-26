const express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Story       = require("../models/story"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

//Add Comments
router.get("/new",middleware.isLoggedIn,function(req,res){
    Story.findById(req.params.id,function(err,foundStory){
        if(err || !foundStory){
            console.log(err);
            req.flash("error","Story not found");
            res.redirect("back");
        }else{
            res.render("comments/new",{story:foundStory});
        }
    });
});

//Comments insertion to show page
router.post("/",middleware.isLoggedIn,function(req,res){
    //look up story using id
    //create a new comment
    //connect new comment to story
    //redirect to story show page
    Story.findById(req.params.id,function(err,foundStory){
        if(err){
            
            console.log(err);
            req.flash("error","Something went wrong");
            res.redirect("back");
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username =  req.user.username;
                    comment.save(); 
                    console.log(comment);
                    //save comment
                    foundStory.comments.push(comment);
                    foundStory.save();
                    req.flash("success","Successfully added comment");
                    res.redirect("/stories/"+req.params.id);
                }
            });
        }
    });
});

// /stories/:id/comments/:comment_id/edit
//Edit comments
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Story.findById(req.params.id,function(err,foundStory){
        if(err || !foundStory){
            req.flash("error","No story found");
            return res.redirect("/stories");
        }else{
            Comment.findById(req.params.comment_id,function(err,comment){
                if(err || !comment){
                    console.log(err);
                    req.flash("error","No comment found")
                    res.redirect("back");
                }else{
                    res.render("comments/edit",{story_id:req.params.id,comment:comment});
                }
            });
        }
    });
    
});

//Update Comment
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            console.log(err);
            req.flash("error","Something went wrong");
            res.redirect("back");
        }else{
            console.log(updatedComment);
            req.flash("success","Comment updated");
            res.redirect("/stories/"+req.params.id);
        }
    });
});

//Destroy Comment
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            req.flash("error","Something went wrong");
            res.redirect("back");
        }else{
            req.flash("success","Comment deleted successfully");
            res.redirect("/stories/"+req.params.id);
        }
    });
});

module.exports = router;