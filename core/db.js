const sqlite3 = require("sqlite3").verbose();
const logger = require("../utils/logger")({
        directory: __dirname,
        file: __filename,
});
const fs = require("fs");
const path = require("path");

let dbInstance = null;

function initializeDb() {
        if (dbInstance) {
                return dbInstance;
        }
        const db = new sqlite3.Database("db.sqlite3", (err) => {
                if (err) {
                        logger.log("Failed to open the database:");
                        logger.log(err);
                        throw err;
                } else {
                        logger.log("Connected to the SQLite database");
                }
        });

        dbInstance = db;

        // Check if tables exist, if not, create them
        const scriptPath = path.join(__dirname, "../db_schema.sql");
        if (fs.existsSync(scriptPath)) {
                const script = fs.readFileSync(scriptPath, "utf-8");
                db.exec(script, (err) => {
                        if (err) {
                                logger.log("Error initializing the database:");
                                logger.log(err);
                                throw err;
                        } else {
                                logger.log("Database initialized successfully.");
                        }
                });
        } else {
                logger.log("Initialization script not found.");
        }

        return db;
}

// get the singleton database instance
const db = () => {
        return initializeDb();
};

module.exports = db;
