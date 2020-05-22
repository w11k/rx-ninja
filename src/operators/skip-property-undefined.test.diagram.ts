import { expectObservable, hot } from "../../spec/helpers/marble-testing";
import { skipPropertyUndefined } from "./skip-property-undefined";

declare function asDiagram(arg: string): Function;

describe("diagram", () => {
    asDiagram(`skipPropertyUndefined(b)`)("should skip values when property b is undefined", () => {
        const a = { a: 1, b: 2 };
        const b = { a: 1, b: undefined };
        // @formatter:off
        const e1 =   hot("a-b-a|", {a, b});
        const expected = "a---a|";
        // @formatter:on

        expectObservable(e1.pipe(skipPropertyUndefined("b"))).toBe(expected, { a });
    });
});
