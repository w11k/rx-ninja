import {assert} from "chai";
import {of} from "rxjs";
import {mapToValueAndChangedProperties} from "./map-to-value-and-changed-properties";

describe("mapToValueWithChangedProperties", function () {

    it("should detect no changes", async function () {

        const observable = of({ a: 1 }, { a: 1 });

        const values: any[] = [];
        const completion = observable
            .pipe(mapToValueAndChangedProperties())
            .forEach(value => {
                values.push(value);
            });

        await completion;

        assert.deepEqual(values, [
            [{ a: 1 }, { a: 1 }],
            [{ a: 1 }, {}],
        ]);

    });

    it("should detect changes of multiple properties", async function () {

        const observable = of(
            { a: 1 },
            { a: 2, b: 3 },
            { a: 2, b: 4 }
        );

        const values: any[] = [];
        const completion = observable
            .pipe(mapToValueAndChangedProperties())
            .forEach(value => {
                values.push(value);
            });

        await completion;

        assert.deepEqual(values, [
            [{ a: 1 }, { a: 1 }],
            [{ a: 2, b: 3 }, { a: 2, b: 3 }],
            [{ a: 2, b: 4 }, { b: 4 }],
        ]);

    });

});
