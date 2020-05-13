import { cold, expectObservable } from "../../spec/helpers/marble-testing";
import { debounceIf } from "./debounce-if";
import { isEven } from "./debounce-if.test";
import { TestScheduler } from "rxjs/testing";

declare function asDiagram(arg: string): Function;
declare const rxTestScheduler: TestScheduler;

describe("diagram", () => {
    asDiagram("debounceIf(20, n => n % 2 === 0)")("should debounce only even values", () => {
        // @formatter:off
        const e1 =  cold("-1--2---3--|", {"1": "1", "2": "2", "3": "3"});
        const expected = "-1----2-3--|";
        // @formatter:on

        expectObservable(e1.pipe(debounceIf(20, isEven, rxTestScheduler))).toBe(expected);
    });
});
