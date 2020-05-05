const axios = require("axios");

describe("my microservice", () => {

    const BASE_URL = "http://localhost:3000"; // Base URL for our HTTP server.

    //
    // Import the module we are testing.
    //

    const { startMicroservice } = require("./index"); 

    //
    // Setup the HTTP server.
    //

    let microservice; // Saves a reference to our microservice object.

    beforeAll(async () => {
        microservice = await startMicroservice(); // Start server before all tests.
    });

    afterAll(async () => {
        await microservice.close();  // Close server after all tests.
    });

    //
    // Wrapper function for doing a HTTP GET request so that we don't have to repeat the base URL 
    // across multiple tests.
    //
    function httpGet(route) {
        const url = `${BASE_URL}${route}`;
        console.log(`Requesting ${url}`);
        return axios.get(url);
    }

    //
    // Tests go here.
    //
    
    test("my http route", async () => {

        const response = await httpGet("/videos");      // Make a HTTP request to the server we are testing.
        expect(response.status).toEqual(200);           // Expect HTTP status code 200 (ok).
        expect(response.data).toEqual({ videos: [] });  // Check the data returned from the HTTP request.
    });

    // ... more tests go here ...

});