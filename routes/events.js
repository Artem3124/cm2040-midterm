const router = require("express").Router();
const userQueries = require("../features/users/db/queries.js");
const eventData = require("../features/events/db/dataService.js");

const logger = require("../utils/logger")({
        directory: __dirname,
        file: __filename,
});

const ensureAuthenticated = (req, res, next) => {
        if (req.session.isAuthenticated) {
                return next();
        }

        res.redirect("/login");
};

const state = {
        user: {},
        selected: { explore: false, attended: false, requests: false },
        newEvents: [],
        userEvents: [],
        requests: [],
        createMode: false,
        lastResponse: { toast: false },
        error: {},
};

/* Approve event request
 * @param {number} requestId - The ID of the request to approve
 * @returns {object} - The response object
 */
router.post("/approve", ensureAuthenticated, async (req, res) => {
        const response = await eventData.approveRequest(req.body.requestId);
        logger.log("Response from approveRequest:");
        logger.log(response.success);

        if (!response.success) {
                state.lastResponse = { success: false, message: "Failed to approve request.", toast: true };
                res.render("events/index.ejs", state);
                return;
        }

        state.lastResponse = { success: true, message: "Request approved successfully.", toast: true };
        await getEvents(req.session.userId);
        res.render("events/index.ejs", state);
});

/* Reject event request 
 * @param {number} requestId - The ID of the request to reject
 * @returns {object} - The response object
 */
router.post("/reject", ensureAuthenticated, async (req, res) => {
        const response = await eventData.rejectRequest(req.body.requestId);

        logger.log("Response from rejectRequest:");
        logger.log(response.success);

        if (!response.success) {
                state.lastResponse = { success: false, message: "Failed to reject request.", toast: true };
                res.render("events/index.ejs", state);
                return;
        }

        state.lastResponse = { success: true, message: "Request rejected successfully.", toast: true };
        await getEvents(req.session.userId);
        res.render("events/index.ejs", state);
});

/**
 * @description Create a new event post request 
 * @param {string} title - The title of the event
 * @param {string} date - The date of the event
 * @param {string} icon - The icon of the event
 * @param {string} location - The location of the event
 * @param {boolean} automaticAccept - The automatic accept of the event
 * @param {number} createdBy - The ID of the user who created the event
 * @param {string} createdAt - The date the event was created
 * @returns {object} - The response object
 */
router.post("/", ensureAuthenticated, async (req, res) => {
        const response = await eventData.createEvent({
                title: req.body.title,
                date: req.body.date,
                icon: req.body.icon,
                location: req.body.location,
                automaticAccept: req.body.automaticAccept,
                createdBy: req.session.userId,
                createdAt: new Date().toISOString(),
        });

        logger.log("Response from createEvent:");
        logger.log(response.success);

        if (!response.success) {
                state.createMode = true;
                state.lastResponse = { success: false, message: "Failed to create event.", toast: true };
                res.render("events/index.ejs", state);
                return;
        }

        await getEvents(req.session.userId);

        state.createMode = false;
        state.lastResponse = { success: true, message: "Event created successfully.", toast: true };

        res.redirect("/events");
});

/**
 * @description Get all events for a user
 * @param {number} userId - The ID of the user
 * @returns {object} - The response object
 * @returns {object} resp.newEvents - The new events
 * @returns {object} resp.userEvents - The users events
 * @returns {object} resp.requests - The requests
 */
const getEvents = async (userId) => {
        const newEvents = await eventData.getNewEvents(userId);
        const userEvents = await eventData.getUsersEvents(userId);
        const requests = await eventData.getRequests(userId);

        if (newEvents === undefined || userEvents === undefined || requests === undefined) {
                state.lastResponse = { success: false, message: "Failed to get events.", toast: true };
        }

        state.newEvents = newEvents;
        state.userEvents = userEvents;
        state.requests = requests;
        return;
};

/**
 * @description Bind an event to a user
 * @param {number} userId - The ID of the user
 * @param {number} eventId - The ID of the event
 * @param {number} eventStatus - The status of the event
 * @returns {object} - The response object
 */
router.post("/bind", ensureAuthenticated, async (req, res) => {
        if (!req.body.eventId) {
                state.lastResponse = { success: false, message: "Missing event ID.", toast: true };
                res.render("events/index.ejs", state);
                return;
        }

        logger.log(req.body.eventStatus);

        const response = await eventData.bindEvent({
                userId: req.session.userId,
                eventId: req.body.eventId,
                eventStatus: req.body.eventStatus,
        });

        logger.log("Response from bindEvent:");
        logger.log(response.success);
        if (!response.success) {
                state.lastResponse = { success: false, message: "Failed to bind event.", toast: true };
                res.render("events/index.ejs", state);
                return;
        }

        state.lastResponse = { success: true, message: "Event bound successfully.", toast: true };
        await getEvents(req.session.userId);
        res.render("events/index.ejs", state);
});

/**
 * @description Render the events page
 */
router.get("/", ensureAuthenticated, async (req, res) => {
        const user = await userQueries.getById(req.session.userId);

        state.lastResponse = { toast: false };
        state.createMode = false;
        state.user = user;

        if (req.query.category) {
                state.selected.explore = req.query.category === "explore";
                state.selected.attended = req.query.category === "attended";
                state.selected.requests = req.query.category === "requests";
        }

        if (req.query.create) {
                state.createMode = true;
        }

        await getEvents(user.id);

        res.render("events/index.ejs", state);
});

module.exports = router;
