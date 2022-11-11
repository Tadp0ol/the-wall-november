const { Router } = require("express");
const UserController = require("../controllers/users.controller");

const UserRoute = Router();

UserRoute.post("/register", UserController.createUser);

UserRoute.post("/login", UserController.loginUser);

UserRoute.options("*", function(req, res, next){
    next();
});

module.exports = UserRoute;