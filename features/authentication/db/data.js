const queries = require("./queries");
const logger = require("../../../utils/logger")({
        directory: __dirname,
        file: __filename,
});

const userExistsFormResponse = (row) => {
        if (row) {
                return true;
        }

        return false;
};

/**
 * @desc Data service to manage business logic layer between the data and controller.
 * @namespace dataService
 * @memberof module:features/authentication/db
 */
const dataService = {
        /**
         * @desc Login method. Check if the user exists and authenticates it.
         * @param {string} loginOrEmail - The login or email.
         * @param {string} password - The password.
         * @returns {Object} resp - Response object.
         * @returns {Object} resp.user - The user object.
         * @returns {boolean} resp.error - The error.
         */
        async login(props = { loginOrEmail, password }) {
                const { loginOrEmail, password } = props;

                let user;

                if (loginOrEmail.includes("@")) {
                        user = await queries.loginWithEmail(loginOrEmail, password);
                } else {
                        user = await queries.loginWithLogin(loginOrEmail, password);
                }

                return { user, error: user === undefined };
        },

        /**
         * Register a new user.
         * @param {Object} props - The user properties.
         * @param {string} props.username - The username.
         * @param {string} props.password - The password.
         * @param {string} props.email - The email.
         * @param {string} props.login - The login.
         * @returns {Object} resp - Response object.
         * @returns {Object} resp.user - The user object.
         * @returns {Object} resp.userExists - The user exists object.
         * @returns {boolean} resp.userExists.email - The email exists.
         * @returns {boolean} resp.userExists.login - The login exists.
         * @returns {boolean} resp.userExists.username - The username exists.
         */
        async register(props = { username, password, email, login }) {
                const { username, password, email, login } = props;

                if (!username || !password || !email || !login) {
                        logger.log("Missing required fields.");
                        return;
                }

                const userExists = {};
                let user = undefined;

                const emailExists = await queries.getByEmail(email);
                userExists.email = emailExists;

                const loginExists = await queries.getByLogin(login);
                userExists.login = loginExists;

                const userNameExists = await queries.getByUsername(username);
                userExists.username = userNameExists;
                logger.log(userExists.email + " " + userExists.login + " " + userExists.username);

                if (!userExists.email && !userExists.login && !userExists.username) {
                        await queries.register(username, password, email, login);
                        user = await queries.loginWithLogin(login, password);
                }

                return { user, userExists };
        },
};

module.exports = dataService;
