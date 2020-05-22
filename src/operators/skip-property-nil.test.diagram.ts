import { expectObservable, hot } from "../../spec/helpers/marble-testing";
import { skipPropertyNil } from "./skip-property-nil";

declare function asDiagram(arg: string): Function;

describe("diagram", () => {
    asDiagram(`skipPropertyNil(b)`)("should skip values when property b null or undefined", () => {
        const a = { a: 1, b: 2 };
        const b = { a: 1, b: null };
        const c = { a: 1, b: undefined };
        // @formatter:off
        const e1 =   hot("a-b-c-a|", {a, b, c});
        const expected = "a-----a|";
        // @formatter:on

        expectObservable(e1.pipe(skipPropertyNil("b"))).toBe(expected, { a });
    });
});
