const express = require("express");

//
// Define your HTTP route handlers here.
//
function setupHandlers(microservice) {

    microservice.app.get("/videos", (req, res) => {
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
        const microservice = { // Create an object to represent our microservice.
            app: app,
        }
        setupHandlers(microservice);

        const port = process.env.PORT && parseInt(process.env.PORT) || 3000;
        const server = app.listen(port, () => {
            microservice.close = () => { // Create a function that can be used to close our server and database.
                return new Promise(resolve => {
                    server.close(() => { // Close the Express server.
                        resolve();
                    });
                });
            };

            resolve(microservice);
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

