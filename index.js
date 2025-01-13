const https = require("https");
const config = require("./config");
const fs = require("fs");
const app = require("./app");

const privateKey = fs.readFileSync("sslcert/server-key.pem", "utf8");
const certificate = fs.readFileSync("sslcert/server-cert.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

const server = https.createServer(credentials, app);
const logger = require("./utils/logger")({
  directory: __dirname,
  file: __filename,
});

server.listen(config.port, () => {
  logger.log(`Example app listening on port ${config.port}`);
  logger.log(`Server running at https://localhost:${config.port}/`);
});
