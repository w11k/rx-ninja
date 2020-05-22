import { expectObservable, hot } from "../../spec/helpers/marble-testing";
import { skipSomePropertyNil } from "./skip-some-property-nil";

declare function asDiagram(arg: string): Function;

describe("diagram", () => {
    asDiagram(`skipSomePropertyNil()`)("should skip values when any property is null or undefined", () => {
        const a = { a: 1, b: 2 };
        const b = { a: 1, b: null };
        const c = { a: null, b: 1 };
        const d = { a: undefined, b: 1 };
        const e = { a: 1, b: undefined };
        // @formatter:off
        const e1 =   hot("a-b-c--d-e-a|", {a, b, c, d, e});
        const expected = "a----------a|";
        // @formatter:on

        expectObservable(e1.pipe(skipSomePropertyNil())).toBe(expected, { a });
    });
});
