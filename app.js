const Express = require("express");
const BodyParser = require("body-parser");
const Path = require("path");
const Session = require("express-session");

const Constants = require("./configs/constants");
const ViewRoute = require("./routes/views.routes");
const UserRoute = require("./routes/users.routes");
const MessageRoute = require("./routes/messages.routes");
const CommentRoute = require("./routes/comments.routes");

const App = Express();

App.use(BodyParser.json({limit: "50mb"}));
App.use(BodyParser.urlencoded({limit: "50mb", extended: true}));
App.set("view engine", "ejs");
App.set("views", Path.join(__dirname, "/views"));
App.use("/assets", Express.static(Path.join(__dirname, "/assets")));

App.use(Session({
    secret: "the-wall",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

App.use("/", ViewRoute);
App.use("/user", UserRoute);
App.use("/message", MessageRoute);
App.use("/comment", CommentRoute);

App.listen(Constants.PORT, () => {
    console.log(`The wall app listening on port ${Constants.PORT}`);
});