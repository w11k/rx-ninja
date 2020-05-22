import { hot, expectObservable } from "../../spec/helpers/marble-testing";
import { skipNil } from "./skip-nil";

declare function asDiagram(arg: string): Function;

describe("diagram", () => {
    asDiagram("skipNil()")("should skip all nil values", () => {
        // @formatter:off
        const e1 =   hot("-a-n-u-b|", {a: "a", n: null, u: undefined, b: "b"});
        const expected = "-a-----b|";
        // @formatter:on

        expectObservable(e1.pipe(skipNil())).toBe(expected);
    });
});
