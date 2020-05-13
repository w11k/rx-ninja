import { mapToValueAndChangedProperties } from "./map-to-value-and-changed-properties";
import { marbles } from "rxjs-marbles";

describe("mapToValueWithChangedProperties", () => {
    it("should detect no changes", marbles(m => {
        // @formatter:off
        const sourceMarble =   "a-a-a|";
        const expectedMarble = "b-c-c|";
        // @formatter:on
        const sourceValues = { a: { a: 1 } };
        const source = m.cold(sourceMarble, sourceValues);
        const expectedOutput = m.cold(expectedMarble, { b: [{ a: 1 }, { a: 1 }], c: [{ a: 1 }, {}] });

        const destination = source.pipe(mapToValueAndChangedProperties()) as any;
        m.expect(destination).toBeObservable(expectedOutput);
    }));

    it("should detect changes of multiple properties", marbles(m => {
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

        const source = m.cold(sourceMarble, { a, b, c });
        const output = m.cold(expectedMarble, { d, e, f });
        const destination = source.pipe(mapToValueAndChangedProperties()) as any;

        m.expect(destination).toBeObservable(output);
    }));
});
