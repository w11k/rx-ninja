import { expectObservable, hot } from "../../spec/helpers/marble-testing";
import { skipPropertyNull } from "./skip-property-null";

declare function asDiagram(arg: string): Function;

describe("diagram", () => {
    asDiagram(`skipPropertyNull(b)`)("should skip values when property b is null", () => {
        const a = { a: 1, b: 2 };
        const b = { a: 1, b: null };
        // @formatter:off
        const e1 =   hot("a-b-a|", {a, b});
        const expected = "a---a|";
        // @formatter:on

        expectObservable(e1.pipe(skipPropertyNull("b"))).toBe(expected, { a });
    });
});
