import { expectObservable, hot } from "../../spec/helpers/marble-testing";
import { replayOn } from "./replay-on";

declare function asDiagram(arg: string): Function;

describe("diagram", () => {
    asDiagram("replayOn(signal)")("should replay last value when signal emits", () => {
        // @formatter:off
        const e1 =      hot("a-b-c|");
        const trigger = hot("---1-|");
        const expected =    "a-bbc|";
        // @formatter:on

        expectObservable(e1.pipe(replayOn(trigger))).toBe(expected);
    });
});
