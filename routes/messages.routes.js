const { Router } = require("express");
const MessagesController = require("../controllers/messages.controller");

const MessageRoute = Router();

MessageRoute.post("/post_message", MessagesController.postMessage);

MessageRoute.post("/delete_message", MessagesController.deleteMessage);

MessageRoute.options("*", function(req, res, next){
    next();
});

module.exports = MessageRoute;