const { Router } = require("express");
const CommentsController = require("../controllers/comments.controller");

const CommentRoute = Router();

CommentRoute.post("/post_comment", CommentsController.postComment);

CommentRoute.post("/delete_comment", CommentsController.deleteComment);

CommentRoute.options("*", function(req, res, next){
    next();
});

module.exports = CommentRoute;