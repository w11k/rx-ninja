import { observableMatcher } from "../../spec/helpers/observableMatcher";
import { mapToValueAndChangedProperties } from "./map-to-value-and-changed-properties";
import { TestScheduler } from "rxjs/testing";

declare function asDiagram(arg: string): Function;

describe("diagram", () => {
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler(observableMatcher);
    });
    // TODO fix diagram
    asDiagram("mapToValueAndChangedProperties()")("should map to value and its changes", () => {
        testScheduler.run(({ hot, cold, expectObservable }) => {
            // @formatter:off
            const sourceMarble =   "a-b-c|";
            const expectedMarble = "d-e-f|";
            // @formatter:on
            const a = { a: 1 };
            const b = { a: 2, b: 3 };
            const c = { a: 2, b: 4 };
            const d = [{ a: 1 }, { a: 1 }];
            const e = [{ a: 2, b: 3 }, { a: 2, b: 3 }];
            const f = [{ a: 2, b: 4 }, { b: 4 }];

            const source = cold(sourceMarble, { a, b, c });
            expectObservable(source.pipe(mapToValueAndChangedProperties())).toBe(expectedMarble, { d, e, f });
        });
    });
});
