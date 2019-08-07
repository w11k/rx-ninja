import { map } from "rxjs/operators";
import { assert } from "chai";
import { of } from "rxjs";
import { hasNoNilProperties, skipSomePropertyNil } from "./skip-some-property-nil";

describe("hasNoNilProperties", function () {

  it("returns true, if all properties are neither null nor undefined", async function () {
    const obj = {
      a: 1 as number | null,
      b: 2 as number | undefined,
    };

    // obj.a.toExponential(); // check: compiler error
    // obj.b.toExponential(); // check: compiler error

    if (hasNoNilProperties(obj)) {
      obj.a.toExponential(); // guard is working
      obj.b.toExponential(); // guard is working
    }
  });

});

describe("skipSomePropertyNil", async function () {

  it("skips values in the stream, if they contain properties that are either null or undefined", async function () {
    const obj = {
      a: 1 as number | null,
      b: 2 as number | undefined,
    };

    await of(obj)
        .pipe(
            skipSomePropertyNil(),
            map(val => [val.a.toString(), val.b.toString()]), // compiler check
        )
        .forEach(val => {
          assert.deepEqual(val, ["1", "2"]);
        });
  });

});
