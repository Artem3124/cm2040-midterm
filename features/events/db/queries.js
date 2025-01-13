const db = require("../../../core/db")();
const { promisify } = require("util");

const queries = {
        getAttendedEvents: (userId) =>
                promisify(db.all.bind(db))(
                        "SELECT DISTINCT e.id AS event_id, e.title, e.date, e.location, e.icon, e.created_by, ue.status FROM events e LEFT JOIN user_event ue ON e.id = ue.event_id WHERE ue.user_id = ? OR e.created_by = ?;",
                        // "SELECT DISTINCT e.id AS event_id, e.title, e.date, e.location, e.icon, e.created_by, COALESCE(ue.status, 4) AS status FROM events e LEFT JOIN user_event ue ON e.id = ue.event_id WHERE e.created_by = ? OR ue.user_id = ?;",
                        [userId],
                ),

        getNewForUser: (userId) =>
                promisify(db.all.bind(db))(
                        "SELECT e.id AS event_id, e.title, e.date, e.location, e.icon, e.created_by, e.automatic_accept FROM events e LEFT JOIN user_event ue ON e.id = ue.event_id AND ue.user_id = ? WHERE ue.user_id IS NULL;",
                        // "SELECT e.id AS event_id, e.title, e.date, e.location, e.icon, e.created_by, e.created_at, e.automatic_accept FROM events e WHERE NOT EXISTS ( SELECT 2 FROM user_event ue WHERE e.id = ue.event_id AND ue.user_id = ? UNION SELECT 1 FROM events e2 WHERE e2.id = e.id AND e2.created_by = ?);",
                        [userId],
                ),
        bindEvent: async (props = { userId, eventId, eventStatus }) => {
                const { userId, eventId, eventStatus } = props;
                try {
                        const dbQuery = promisify(db.run.bind(db));

                        await dbQuery(`INSERT INTO user_event (user_id, event_id, status) VALUES (?, ?, ?);`, [userId, eventId, eventStatus]);

                        return { success: true, message: "Event bound successfully." };
                } catch (error) {
                        console.error("Error binding event:", error.message);

                        return { success: false, message: "Failed to bind event.", error: error.message };
                }
        },

        rejectRequest: async (requestId) => {
                try {
                        const dbQuery = promisify(db.run.bind(db));

                        await dbQuery("UPDATE user_event SET status = 3 WHERE id = ?;", [requestId]);

                        return { success: true, message: "Request rejected successfully." };
                } catch (error) {
                        console.error("Error rejecting request:", error.message);

                        return { success: false, message: "Failed to reject request.", error: error.message };
                }
        },

        approveRequest: async (requestId) => {
                try {
                        const dbQuery = promisify(db.run.bind(db));

                        await dbQuery("UPDATE user_event SET status = 2 WHERE id = ?;", [requestId]);

                        return { success: true, message: "Request approved successfully." };
                } catch (error) {
                        console.error("Error approving request:", error.message);

                        return { success: false, message: "Failed to approve request.", error: error.message };
                }
        },

        getRequests: (userId) =>
                promisify(db.all.bind(db))(
                        "SELECT ue.id AS request_id, ue.user_id, ue.status, e.title, e.date, e.location, e.icon, u.username, e.created_by FROM user_event ue JOIN events e ON ue.event_id = e.id JOIN users u ON ue.user_id = u.id JOIN users uc ON e.created_by = uc.id WHERE e.created_by = ? AND ue.status <= 3 AND ue.user_id != ?;",
                        [userId, userId],
                ),

        createEvent: async (props = { title, date, icon, automaticAccept, location, createdBy, createdAt }) => {
                try {
                        const { title, date, icon, automaticAccept, location, createdBy, createdAt } = props;

                        // Ensure all necessary fields are provided
                        if (!title || !date || !createdBy || !createdAt) {
                                throw new Error("Missing required fields: title, date, createdBy, or createdAt.");
                        }

                        const dbQuery = promisify(db.run.bind(db));

                        await dbQuery(
                                `INSERT INTO events (title, date, icon, automatic_accept, location, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                                [title, date, icon, automaticAccept, location, createdBy, createdAt],
                        );

                        return { success: true, message: "Event created successfully." };
                } catch (error) {
                        console.error("Error creating event:", error.message);

                        return { success: false, message: "Failed to create event.", error: error.message };
                }
        },
};

module.exports = queries;
