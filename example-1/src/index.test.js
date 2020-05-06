
describe("metadata microservice", () => {

    //
    // Setup mocks.
    //

    const mockListenFn = jest.fn((port, callback) => callback());
    const mockGetFn = jest.fn();

    jest.doMock("express", () => { // Mock the Express module.
        return () => { // The Express module is a factory function that creates an Express app object.
            return { // Mock Express app object.
                listen: mockListenFn,
                get: mockGetFn,
            };
        };
    });
    
    //
    // Import the module we are testing.
    //

    const { startMicroservice } = require("./index"); 

    //
    // Tests go here.
    //
    
    test("microservice starts web server on startup", async () => {
        
        await startMicroservice();

        expect(mockListenFn.mock.calls.length).toEqual(1);     // Check only 1 call to 'listen'.
        expect(mockListenFn.mock.calls[0][0]).toEqual(3000);   // Check for port 3000.
    });

    test("/videos route is empty", async () => {

        await startMicroservice();

        expect(mockGetFn).toHaveBeenCalled();

        const mockRequest = {};
        const mockResponse = {
            json: jest.fn(),
        };

        const videosRoute = mockGetFn.mock.calls[0][0];
        expect(videosRoute).toEqual("/videos");

        const videosRouteHandler = mockGetFn.mock.calls[0][1];
        videosRouteHandler(mockRequest, mockResponse); // Invoke our request handler.

        expect(mockResponse.json.mock.calls.length).toEqual(1); // Expect that the json fn was called.
        expect(mockResponse.json.mock.calls[0][0]).toEqual({
            videos: [], // We don't have any videos yet.
        });
    });

    // ... more tests go here ...
    
});