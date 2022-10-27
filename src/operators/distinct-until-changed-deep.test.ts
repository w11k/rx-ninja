import { marbles } from "rxjs-marbles";
import { deepEqual, distinctUntilChangedDeep } from "./distinct-until-changed-deep";
import { expect } from "chai";

describe("distinctUntilChangedDeep", () => {
    it("should emit only once on same primitives", marbles(m => {
        // @formatter:off
        const source   = m.cold("a-a-a|");
        const expected = m.cold("a----|");
        // @formatter:on
        const destination = source.pipe(distinctUntilChangedDeep(1));
        m.expect(destination).toBeObservable(expected);
    }));

    it("should emit only once on equal objects", marbles((m) => {
        const a: any = {
            foo: "bar",
            baz: {},
        };

        const b = {
            foo: "bar",
            baz: {},
        };

        // @formatter:off
        const source   = m.cold("a-b|", {a, b});
        const expected = m.cold("a--|", {a});
        // @formatter:on

        const destination = source.pipe(distinctUntilChangedDeep(2));
        m.expect(destination).toBeObservable(expected);
    }));

    it("should emit for changed properties", marbles((m) => {
        const a: any = {
            foo: "bar",
            baz: undefined,
        };

        const b = {
            foo: "bar",
            baz: {},
        };

        // @formatter:off
        const source   = m.cold("a-b|", {a, b});
        const expected = m.cold("a-b|", {a, b});
        // @formatter:on

        const destination = source.pipe(distinctUntilChangedDeep(1));
        m.expect(destination).toBeObservable(expected);
    }));

    it("should throw an exception for negative maxDepth", marbles((m) => {
        const source = m.cold("|");
        const mustThrow = () => source.pipe(distinctUntilChangedDeep(-1));
        expect(mustThrow).to.throw();
    }));

    it("should return true for an array with objects and primitive leaves", () => {
        const a = [{ foo: "bar" }, { bar: 1 }, { baz: true }];
        const b = [{ foo: "bar" }, { bar: 1 }, { baz: true }];

        expect(deepEqual(a, b, 2)).to.eq(true);
    });
});

describe("deepEquals", () => {
    it("should return true for equal primitives and maxDepth 0", () => {
        const a = "foo";
        const b = "foo";
        expect(deepEqual(a, b, 0, 0)).to.eq(true);
    });

    it("should return true for two different arrays with same primitives", () => {
        const a = [1, 2, 3, "foo"];
        const b = [1, 2, 3, "foo"];
        expect(deepEqual(a, b, 1)).to.eq(true);
    });

    it("should return false for not equal primitives and maxDepth 0", () => {
        const a = "foo";
        const b = "bar";
        expect(deepEqual(a, b, 0)).to.eq(false);
    });

    it("should return false for two different objects and maxDepth 0", () => {
        const a = {};
        const b = {};

        expect(deepEqual(a, b, 0)).to.eq(false);
    });

    it("should return false for two different arrays and maxDepth 0", () => {
        const a: any[] = [];
        const b: any[] = [];

        expect(deepEqual(a, b, 0)).to.eq(false);
    });

    it("should return true for deep equal arrays", () => {
        const a = [ // depth 0
            { // depth 1
                foo: "bar" // depth 2
            },
            { // depth 1
                bar: [ // depth 2
                    1  // depth 3
                ]
            },
            {
                baz: {  // depth 2
                    bar: 2,  // depth 3
                }
            }
        ];
        const b = [ // depth 0
            { // depth 1
                foo: "bar" // depth 2
            },
            {
                bar: [  // depth 2
                    1  // depth 3
                ]
            },
            { // depth 1
                baz: { // depth 2
                    bar: 2 // depth 3
                }
            }
        ];

        expect(deepEqual(a, b, 0)).to.eq(false);
        expect(deepEqual(a, b, 1)).to.eq(false);
        expect(deepEqual(a, b, 2)).to.eq(false);
        expect(deepEqual(a, b, 3)).to.eq(true);
    });

    it("should return false for unequal object structures", () => {
        const a = {
            1: {
                2: {
                    3: false,
                }
            }
        };

        const b = {
            1: {
                2: {
                    3: true,
                }
            }
        };

        expect(deepEqual(a, b, 0)).to.eq(false);
        expect(deepEqual(a, b, 1)).to.eq(false);
        expect(deepEqual(a, b, 2)).to.eq(false);
        expect(deepEqual(a, b, 3)).to.eq(false);
    });

});
