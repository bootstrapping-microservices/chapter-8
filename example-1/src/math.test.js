//
// A trivial example of automated testing with Jest.
//


const { square } = require("./math");

describe("square function", () => {

    test("can square two", () => {

        const result = square(2);
        expect(result).toBe(4);
    });
});