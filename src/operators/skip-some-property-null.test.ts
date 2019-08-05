import { map } from "rxjs/operators";
import { assert } from "chai";
import { of } from "rxjs";
import { hasNoNullProperties, skipSomePropertyNull } from "./skip-some-property-null";

describe("hasNoNullProperties", function () {

  it("works", async function () {
    const obj = {
      a: 1 as number | null,
      b: 2 as number,
    };

    // obj.a.toExponential(); // check: compiler error
    obj.b.toExponential();

    if (hasNoNullProperties(obj)) {
      obj.a.toExponential(); // guard is working
      obj.b.toExponential();
    }
  });

});

describe("skipSomePropertyNull", async function () {

  it("works", async function () {
    const obj = {
      a: 1 as number | null,
      b: 2 as number,
    };

    await of(obj)
        .pipe(
            skipSomePropertyNull(),
            map(val => val.a.toString()), // compiler check
        )
        .forEach(val => {
          assert.equal(val, "1");
        });
  });

});
