const express = require("express");
const assert = require("assert");
const router = express.Router();
const dataService = require("../features/authentication/db/data");

const logger = require("../utils/logger")({
        directory: __dirname,
        file: __filename,
});

/**
 * @desc Global state for the authentication routs
 */
const loginState = {
        error: false,
        registered: false,
}

/**
 * @desc Authentication guard, to make sure the user is not authenticated
 */
const ensureAuthenticated = (req, res, next) => {
        if (req.session.isAuthenticated) {
                res.redirect("/events");
                return;
        }

        return next();
};

/** 
 * @desc Check if any of the fields in the object are true
 */
const fields = (obj) => {
        let res = false;
        for (const key in obj) {
                if (obj[key]) {
                        res = true;
                }
        }

        return res;
};

/** 
 * @desc Login page render
 */
router.get("/login", ensureAuthenticated,(_, res) => {
        logger.log("GET / login");
        res.render("auth/login.ejs", loginState);
        return;
});


/**
 * @desc Register page render
 */
router.get("/register", ensureAuthenticated,( _, res) => {
        res.render("auth/register.ejs", {
                email: false,
                login: false,
                username: false,
        });
        return;
});

/**
 * @desc Logout the user
 */
router.get("/logout", (req, res) => {
        req.session.isAuthenticated = false;
        req.session.userId = null;
        res.redirect("/login");
});

// TODO: Datafields should be validated in dataService (i.e. business logic layer)
/**
 * @desc Login the user
 * @param loginOrEmail - the login or email of the user
 * @param password - the password of the user
 */
router.post("/login", async (req, res) => {
        logger.log("POST / login");

        const response = await dataService.login({
                loginOrEmail: req.body.login,
                password: req.body.password,
        });

        logger.log(response.error);
        if (response.error) {
                loginState.error = true;
                res.render("auth/login.ejs", loginState);
                return;
        }

        loginState.error = false;

        req.session.isAuthenticated = true;
        req.session.userId = response.user.id;

        res.redirect("/events");
});

router.post("/register", async (req, res) => {
        logger.log("POST / register");

        const response = await dataService.register({
                username: req.body.username,
                email: req.body.email,
                login: req.body.login,
                password: req.body.password,
        });

        if (fields(response.userExists)) {
                res.render("auth/register.ejs", response.userExists);
                return;
        }

        loginState.registered = true;
        loginState.error = false;

        res.render("auth/login.ejs", loginState);
});

module.exports = router;
