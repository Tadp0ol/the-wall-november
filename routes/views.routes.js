const { Router } = require("express");
const ViewController = require("../controllers/views.controller");

const ViewRoute = Router();

ViewRoute.get("/", (req, res) =>{
    return new ViewController(req, res).loginRegister();
});

ViewRoute.get("/dashboard", (req, res) =>{
    return new ViewController(req, res).dashboard();
});

ViewRoute.get("/logout", (req, res) =>{
    return new ViewController(req, res).logout();
});

module.exports = ViewRoute;