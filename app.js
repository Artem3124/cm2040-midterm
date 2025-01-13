const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const fs = require("fs");
const db = require("./core/db")();

const app = express();

app.use(
        session({
                secret: fs.readFileSync("sslcert/server-key.pem", "utf8"),
                resave: false,
                saveUninitialized: true,
                cookie: { secure: true },
        }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public")); // set location of static files
app.use("/bootstrap-icons", express.static(path.join(__dirname, "node_modules/bootstrap-icons/font")));
app.use("/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist")));

app.set("view engine", "ejs"); // set the app to use ejs for rendering

app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

        res.setHeader("Access-Control-Allow-Credentials", true);

        next();
});

require("./routes")(app);

module.exports = app;
