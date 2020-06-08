import { hasNoUndefinedProperties, skipSomePropertyUndefined } from "./skip-some-property-undefined";
import { map } from "rxjs/operators";
import { assert } from "chai";
import { of } from "rxjs";
import { expectObservable, hot } from "../../spec/helpers/marble-testing";

declare function asDiagram(arg: string): Function;

describe("diagram skipSomePropertyUndefined", () => {
  asDiagram(`skipSomePropertyUndefined()`)("should skip values when any property is undefined", () => {
    const a = { a: 1, b: 2 };
    const b = { a: 1, b: undefined };
    const c = { a: undefined, b: 1 };
    // @formatter:off
    const e1 =   hot("a-b-c-a|", {a, b, c});
    const expected = "a-----a|";
    // @formatter:on

    expectObservable(e1.pipe(skipSomePropertyUndefined())).toBe(expected, { a });
  });
});

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
