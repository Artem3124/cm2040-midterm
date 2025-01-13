const queries = require("./queries.js");
const logger = require("../../../utils/logger")({
        directory: __dirname,
        file: __filename,
});

const eventStatus = {
        PENDING: 1,
        ACCEPTED: 2,
        REJECTED: 3,
};

const dataService = {
        getUsersEvents: async (id) => {
                const response = await queries.getAttendedEvents(id);
                return response;
        },
        getNewEvents: async (id) => {
                return await queries.getNewForUser(id);
        },
        getRequests: async (id) => {
                return await queries.getRequests(id);
        },

        /** 
         * @desc Bind event to user
         * @param {Object} props - The properties
         * @param {number} props.userId - The user ID
         * @param {number} props.eventId - The event ID
         * @param {number} props.eventStatus - The event status
         * @returns {Object} response - The response object
         * @returns {boolean} response.success - The success
         * @returns {string} response.message - The message
         * @returns {string} response.error - The error
         * */
        bindEvent: async (props = { userId, eventId, eventStatus }) => {
                const response = await queries.bindEvent(props);
                if (!response.success) {
                        logger.log("Failed to bind event:");
                        logger.log(response.error);
                        return response;
                }
                return response;
        },

        rejectRequest: async (requestId) => {
                const response = await queries.rejectRequest(requestId);
                if (!response.success) {
                        logger.log("Failed to reject request:");
                        logger.log(response.error);
                        return response;
                }

                return response;
        },

        approveRequest: async (requestId) => {
                const response = await queries.approveRequest(requestId);
                if (!response.success) {
                        logger.log("Failed to approve request:");
                        logger.log(response.error);
                        return response;
                }
                return response;
        },
        createEvent: async (props = { title, date, icon, automaticAccept, createdBy, createdAt }) => {
                const response = await queries.createEvent(props);
                if (!response.success) {
                        logger.log("Failed to create event:");
                        logger.log(response.error);
                        return response;
                }
                return response;
        },
};

module.exports = dataService;
