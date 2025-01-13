const users = require("./users");
const auth = require("./authentication");
const events = require("./events");

const routes = (app) => {
        app.set("views", __dirname + "/../views");
        // user responsible routes - DEPRECATED
        app.use("/users", users);
        // authentication routes - ACTUAL
        app.use("", auth);
        // event routes - ACTUAL
        app.use("/events", events);
        // outher routes will be redirected to login
        app.use("/", (req, res) => {
                res.redirect("/login");
        });
};

module.exports = routes;
