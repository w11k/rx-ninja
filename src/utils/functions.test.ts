import { assert } from "chai";
import { entries } from "./functions";

describe("entries", function () {

    it("should map empty object", function () {
        const obj = { };

        const actualValue = entries(obj);
        const expectedValue: [string, any][] = [ ];

        assert.deepEqual(actualValue, expectedValue);
    });

    it("should map object with properties", function () {
        const obj = { a: 1, 2: "b" };

        const actualValue = entries(obj);
        const expectedValue: [string, any][] = [ ["a", 1], ["2", "b"] ];

        assert.notSameOrderedMembers(actualValue, expectedValue);
    });
});
