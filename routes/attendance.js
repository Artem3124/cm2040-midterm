const express = require("express");
const router = express.Router();

router.get("/attended-events", (req, res) => {
    res.render("attended-events.ejs");
});
