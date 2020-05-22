import { hot, expectObservable } from "../../spec/helpers/marble-testing";
import { skipNull } from "./skip-null";

declare function asDiagram(arg: string): Function;

describe("diagram", () => {
    asDiagram("skipNull()")("should skip all null values", () => {
        // @formatter:off
        const e1 =   hot("-a-n-b|", {a: "a", n: null, b: "b"});
        const expected = "-a---b|";
        // @formatter:on

        expectObservable(e1.pipe(skipNull())).toBe(expected);
    });
});
