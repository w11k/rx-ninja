import { hot, expectObservable } from "../../spec/helpers/marble-testing";
import { skipUndefined } from "./skip-undefined";

declare function asDiagram(arg: string): Function;

describe("diagram", () => {
    asDiagram("skipUndefined()")("should skip all undefined values", () => {
        // @formatter:off
        const e1 =   hot("-a-u-b|", {a: "a", u: undefined, b: "b"});
        const expected = "-a---b|";
        // @formatter:on

        expectObservable(e1.pipe(skipUndefined())).toBe(expected);
    });
});
