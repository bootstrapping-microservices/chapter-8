const express = require("express");

//
// Define your HTTP route handlers here.
//
function setupHandlers(app) {

    app.get("/videos", (req, res) => {
        res.json({
            videos: [], // LATER ON WE'LL RETURN DATA FROM THE DATABASE.
        });
    });

    // Add other handlers here.
}

//
// Starts the Express HTTP server.
//
function startHttpServer() {
    return new Promise(resolve => { // Wrap in a promise so we can be notified when the server has started.
        const app = express();
        setupHandlers(app);

        const port = process.env.PORT && parseInt(process.env.PORT) || 3000;
        app.listen(port, () => {
            resolve();
        });
    });
}

//
// Collect code here that executes when the microservice starts.
//
function startMicroservice() {
    return startHttpServer();
}

//
// Application entry point.
//
function main() {
    return startMicroservice();
}

if (require.main === module) {
    // Only start the microservice normally if this script is the "main" module.
    main()
        .then(() => console.log("Microservice online."))
        .catch(err => {
            console.error("Microservice failed to start.");
            console.error(err && err.stack || err);
        });
}
else {
    // Otherwise we are running under test
    module.exports = {
        startMicroservice,
    };
}

