const { Router } = require("express");
const MessagesController = require("../controllers/messages.controller");

const MessageRoute = Router();

MessageRoute.post("/create", MessagesController.create);
MessageRoute.post("/delete", MessagesController.delete);

MessageRoute.options("*", function(req, res, next){
    next();
});

module.exports = MessageRoute;