import funcs from "./funcs";
console.log("fml");

const describe = window.describe;
const it = window.it;
const fc = window.fastcheck;
const chai = window.chai;

describe("Mocha", function () {
    it("Correctly initialises Mocha", function () {
    });

    it("Correctly initialises FastCheck", function () {
        fc.assert(fc.property(fc.integer(), () => true));
    });
});


//Example based Testing
describe("Example testing", function () {
    it("Distance between two points returns as expected", function () {
        const mx = 2, my = 0, ex = 3, ey = 0; //step by step explanation
        const dist = funcs.distFromPoint(mx, my, ex, ey);
        const expected = 1;
        chai.expect(dist).to.deep.equal(expected);
        if(!funcs.equals(dist,expected)) {
            throw "Distance between two points did mot return as expected";
            };

        chai.expect(funcs.distFromPoint(1,3,6,3).to.deep.equal(5)); //shortform?
        chai.expect(funcs.distFromPoint(3,1,3,6).to.deep.equal(5));

        it("Clearing Screen works as expected", function () {
            const start = ["a", "b", "c", "d"];//long form
            keyNum = 3;
            const expected = ["a", "b", "c"]
            chai.expect(
                funcs.clearScreen(start, keyNum)).to.deep.equal(expected);
            })
        });
    });
//Property based Testing
describe("Property testing", function () {
    it("Deletion funcs work as expected", function () {
        const start = ["a", "b", "c", "d", "e", "f",
                 "g", "h", "i", "j", "k", "l", "m"];
        keyNum = Math.floor(Math.random() * 10);s
        const cleared = funcs.clearScreen(start, keyNum);
        chai.expect(cleared.length).to.deep.equal(keyNum);
        chai.expect(cleared[keyNum - 1]).to.deep.equal(start[keyNum - 1]);
    })
});
