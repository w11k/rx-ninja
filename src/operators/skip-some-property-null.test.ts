import { map } from "rxjs/operators";
import { assert } from "chai";
import { of } from "rxjs";
import { hasNoNullProperties, skipSomePropertyNull } from "./skip-some-property-null";
import { expectObservable, hot } from "../../spec/helpers/marble-testing";

declare function asDiagram(arg: string): Function;

describe("diagram skipSomePropertyNull", () => {
  asDiagram(`skipSomePropertyNull()`)("should skip values when any property is null", () => {
    const a = { a: 1, b: 2 };
    const b = { a: 1, b: null };
    const c = { a: null, b: 1 };
    // @formatter:off
    const e1 =   hot("a-b-c-a|", {a, b, c});
    const expected = "a-----a|";
    // @formatter:on

    expectObservable(e1.pipe(skipSomePropertyNull())).toBe(expected, { a });
  });
});

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
