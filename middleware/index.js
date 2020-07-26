//all middleware goes here
const   Story       = require("../models/story"),
        Comment     = require("../models/comment");
var middlewareObj={};

middlewareObj.checkStoryOwnership=(req,res,next)=>{
    //is user logged in?
    if(req.isAuthenticated()){
        Story.findById(req.params.id,function(err,foundStory){
            if(err || !foundStory){
                req.flash("error","Story not found");
                res.redirect("back");
            }else{
                //does user own the campground
                if(foundStory.author.id.equals(req.user._id)){
                    next();
                }
                //if not, redirect
                else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    //otherwise redirect
    else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership=(req,res,next)=>{
    //is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err || !foundComment){
                req.flash("error","Comment not found");
                res.redirect("back");
            }else{
                //does user own the comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
                //if not, redirect
                else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    //otherwise redirect
    else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that");
    res.redirect("/login");
}

module.exports=middlewareObj;