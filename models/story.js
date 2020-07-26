const mongoose = require("mongoose");


//Story Schema - name,image,description
const storySchema = new mongoose.Schema({
    name : String,
    image : String,
    country: String,
    description : String,
    author : {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref  : "Comment"
        }
    ]
});

module.exports = mongoose.model("Story",storySchema);
