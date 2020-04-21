const express = require("express");

function setupHandlers(app) {

    app.get("/my-http-route", (req, res) => {
        res.json({
            result: 5,
        });
    });
}

function startHttpServer() {
    return new Promise(resolve => { // Wrap in a promise so we can be notified when the server has started.
        const app = express();
        setupHandlers(app);

        const port = process.env.PORT && parseInt(process.env.PORT) || 3000;
        const server = app.listen(port, () => {
            resolve({ // Return an object with a 'close' function that can be used to close our HTTP server.
                close: () => {
                    return new Promise(resolve => {
                        server.close(() => { // Close the Express close function.
                            resolve(); // Resolve the promise when the server has closed.
                        });
                    })
                },  
            });
        });
    });
}

module.exports = {
    startHttpServer,
};