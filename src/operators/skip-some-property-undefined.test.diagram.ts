import { expectObservable, hot } from "../../spec/helpers/marble-testing";
import { skipSomePropertyUndefined } from "./skip-some-property-undefined";

declare function asDiagram(arg: string): Function;

describe("diagram", () => {
    asDiagram(`skipSomePropertyUndefined()`)("should skip values when any property is undefined", () => {
        const a = { a: 1, b: 2 };
        const b = { a: 1, b: undefined };
        const c = { a: undefined, b: 1 };
        // @formatter:off
        const e1 =   hot("a-b-c-a|", {a, b, c});
        const expected = "a-----a|";
        // @formatter:on

        expectObservable(e1.pipe(skipSomePropertyUndefined())).toBe(expected, { a });
    });
});
