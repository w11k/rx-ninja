import { hasNoUndefinedProperties, skipSomePropertyUndefined } from "./skip-some-property-undefined";
import { map } from "rxjs/operators";
import { assert } from "chai";
import { of } from "rxjs";

describe("hasNoUndefinedProperties", function () {

  it("works", async function () {
    const obj = {
      a: 1 as number | undefined,
      b: 2 as number,
    };

    // obj.a.toExponential(); // check: compiler error
    obj.b.toExponential();

    if (hasNoUndefinedProperties(obj)) {
      obj.a.toExponential(); // guard is working
      obj.b.toExponential();
    }
  });

});

describe("skipSomePropertyUndefined", async function () {

  it("works", async function () {
    const obj = {
      a: 1 as number | undefined,
      b: 2 as number,
    };

    await of(obj)
        .pipe(
            skipSomePropertyUndefined(),
            map(val => val.a.toString()), // compiler check
        )
        .forEach(val => {
          assert.equal(val, "1");
        });
  });

});
