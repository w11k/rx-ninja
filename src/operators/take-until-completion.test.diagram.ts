import { expectObservable, hot } from "../../spec/helpers/marble-testing";
import { takeUntilCompletion } from "./take-until-completion";

declare function asDiagram(arg: string): Function;

describe("diagram", () => {
    asDiagram("takeUntilCompletion(other)")("should skip all undefined values", () => {
        // @formatter:off
        const e1 = hot("-a--b|");
        const e2 = hot("---|");
        const expected = "-a--|";
        // @formatter:on

        expectObservable(e1.pipe(takeUntilCompletion(e2))).toBe(expected);
    });
});
