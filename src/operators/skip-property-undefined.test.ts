import { assert } from "chai";
import { of } from "rxjs";
import { first, tap } from "rxjs/operators";
import { skipPropertyUndefined } from "./skip-property-undefined";

describe("skipPropertyUndefined", function () {

  it("should should pass object with just values", async function () {
    const testObj = {
      a: "a" as string | undefined,
      b: "b" as string,
    };

    const testObj$ = of(testObj);

    const completion = testObj$
    // functional test
        .pipe(
            skipPropertyUndefined("a"),
            first(), // let rxjs throw error on completion without previous value
        )
        // just for compiler check, a and b are strings
        .pipe(
            tap(x => x.a.charAt(0)),
            tap(x => x.b.charAt(0)),
        )
        .forEach(x => {
            assert.equal(x, testObj);
        });

    await completion;
  });

  it("should filter object with undefined", async function () {
    const testObj = {
      a: undefined as string | undefined,
      b: "b" as string,
    };

    const testObj$ = of(testObj);

    const completion = testObj$
        // functional test
        .pipe(
            skipPropertyUndefined("a")
        )
        // just for compiler check, a and b are strings
        .pipe(
            tap(x => x.a.charAt(0)),
            tap(x => x.b.charAt(0)),
        )
        .forEach(x => {
          throw new Error(`shouldn't run here, object should be filtered, x is "${JSON.stringify(x)}"`);
        });

    await completion;
  });

  it("should pass object with null", async function () {
    const testObj = {
      a: null as string | null | undefined,
      b: "b" as string,
    };

    const testObj$ = of(testObj);

    const completion = testObj$
    // functional test
        .pipe(
            skipPropertyUndefined("a")
        )
        // just for compiler check, a and b are strings
        .pipe(
            // tap(x => x.a.charAt(0)), //
            tap(x => x.b.charAt(0)),
        )
        .forEach(x => {
          assert.isNull(x.a);
        });

    await completion;
  });

});
