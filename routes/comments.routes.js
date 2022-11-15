const { Router } = require("express");
const CommentController = require("../controllers/comments.controller");

const CommentRoute = Router();

CommentRoute.post("/create", CommentController.create);

CommentRoute.post("/delete", CommentController.delete);

CommentRoute.options("*", function(req, res, next){
    next();
});

module.exports = CommentRoute;