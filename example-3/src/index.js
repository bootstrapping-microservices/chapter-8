const express = require("express");
const mongodb = require("mongodb");

//
// Connect to the database.
//
function connectDb(dbhost, dbname) {
    return mongodb.MongoClient.connect(dbhost, { useUnifiedTopology: true }) 
        .then(client => {
            const db = client.db(dbname);
            return {                // Return an object that represents the database connection.
                db: db,             // To access the database...
                close: () => {      // and later close the connection to it.
                    return client.close();
                },
            };
        });
}

//
// Define your HTTP route handlers here.
//
function setupHandlers(microservice) {

    const videosCollection = microservice.db.collection("videos");

    microservice.app.get("/videos", (req, res) => {
        videosCollection.find()
            .toArray()
            .then(videos => {
                res.json({ 
                    videos: videos
                });
            })
            .catch(err => {
                console.error("Failed to get videos collection from database!");
                console.error(err && err.stack || err);
                res.sendStatus(500);
            });
    });
}

//
// Starts the Express HTTP server.
//
function startHttpServer(dbConn) {
    return new Promise(resolve => { // Wrap in a promise so we can be notified when the server has started.
        const app = express();
        const microservice = { // Create an object to represent our microservice.
            app: app,
            db: dbConn.db,
        }
        setupHandlers(microservice);

        const port = process.env.PORT && parseInt(process.env.PORT) || 3000;
        const server = app.listen(port, () => {
            microservice.close = () => { // Create a function that can be used to close our server and database.
                return new Promise(resolve => {
                    server.close(() => { // Close the Express server.
                        resolve();
                    });
                })
                .then(() => {
                    return dbConn.close(); // Close the database.
                });
            };
            resolve(microservice);
        });
    });
}

//
// Collect code here that executes when the microservice starts.
//
function startMicroservice(dbhost, dbname) {
    return connectDb(dbhost, dbname)            // Connect to the database...
        .then(dbConn => {                       // then...
            return startHttpServer(dbConn);     // start the HTTP server.
        });
}

//
// Application entry point.
//
function main() {
    if (!process.env.DBHOST) {
        throw new Error("Please specify the databse host using environment variable DBHOST.");
    }
    
    const DBHOST = process.env.DBHOST;

    if (!process.env.DBNAME) {
        throw new Error("Please specify the databse name using environment variable DBNAME.");
    }
    
    const DBNAME = process.env.DBNAME;
        
    return startMicroservice(DBHOST, DBNAME);
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

