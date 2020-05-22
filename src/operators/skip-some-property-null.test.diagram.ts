import { expectObservable, hot } from "../../spec/helpers/marble-testing";
import { skipSomePropertyNull } from "./skip-some-property-null";

declare function asDiagram(arg: string): Function;

describe("diagram", () => {
    asDiagram(`skipSomePropertyNull()`)("should skip values when any property is null", () => {
        const a = { a: 1, b: 2 };
        const b = { a: 1, b: null };
        const c = { a: null, b: 1 };
        // @formatter:off
        const e1 =   hot("a-b-c-a|", {a, b, c});
        const expected = "a-----a|";
        // @formatter:on

        expectObservable(e1.pipe(skipSomePropertyNull())).toBe(expected, { a });
    });
});
