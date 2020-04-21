
describe("my microservice", () => {

    //
    // Setup mocks.
    //

    const mockListenFn = jest.fn((port, callback) => callback());

    jest.doMock("express", () => { // Mock the Express module.
        return () => { // The Express module is a factory function that creates an Express app object.
            return { // Mock Express app object.
                listen: mockListenFn,
            };
        };
    });
    
    //
    // Import the module we are testing.
    //

    const { startHttpServer } = require("./index"); 

    //
    // Tests go here.
    //
    
    test("starting web server listens on port 3000", async () => {
        
        await startHttpServer();

        expect(mockListenFn.mock.calls.length).toBe(1);     // Check only 1 call to 'listen'.
        expect(mockListenFn.mock.calls[0][0]).toBe(3000);   // Check for port 3000.
    });

});