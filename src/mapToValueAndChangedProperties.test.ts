import {assert} from "chai";
import {of} from "rxjs";
import {mapToValueAndChangedProperties} from "./mapToValueAndChangedProperties";

describe("mapToValueWithChangedProperties", function () {
    it("test", function () {

        const observable = of(
            {a: 1},
            {a: 2, b: 3},
            {a: 2, b: 4}
        );

        const values: any[] = [];
        observable
            .pipe(mapToValueAndChangedProperties())
            .subscribe(value => {
                values.push(value);
            });

        assert.deepEqual(values, [
            [{a: 1}, {a: 1}],
            [{a: 2, b: 3}, {a: 2, b: 3}],
            [{a: 2, b: 4}, {b: 4}],
        ]);

    });

});
