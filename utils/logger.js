const path = require("path");


const logger = (props = { directory, file }) => {
        const { file } = props;
        return {
                log: (message) => {
                        const dir = path.dirname(file).split("/").slice(-2).join("/");
                        const f = file.split("/").pop();
                        console.log(`[${dir}/${f}]: ${message}`);
                },
        };
};

module.exports = logger;
