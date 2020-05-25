import { cold, expectObservable, hot } from "../../spec/helpers/marble-testing";
import { onCompletionContinueWith } from "./on-completion-continue-with";

declare function asDiagram(arg: string): Function;


describe("diagram", () => {
    asDiagram("onCompletionContinueWith(otherGenerator)")("should debounce only even values", () => {
        // @formatter:off
        const e1 =       hot("-a-b-c-|");
        const e2 =      cold("-d-e-f-|");
        const expected = "-a-b-c--d-e-f-|";
        // @formatter:on

        expectObservable(e1.pipe(onCompletionContinueWith(() => e2))).toBe(expected);
    });
});
