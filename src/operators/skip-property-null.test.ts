import { assert } from "chai";
import { of } from "rxjs";
import { first, tap } from "rxjs/operators";
import { skipPropertyNull } from "./skip-property-null";


describe("skipPropertyNull", function () {

  it("should should pass object with just values", async function () {
    const testObj = {
      a: "a" as string | null,
      b: "b" as string,
    };

    const testObj$ = of(testObj);

    const completion = testObj$
    // functional test
        .pipe(
            skipPropertyNull("a"),
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

  it("should filter object with null", async function () {
    const testObj = {
      a: null as string | null,
      b: "b" as string,
    };

    const testObj$ = of(testObj);

    const completion = testObj$
        // functional test
        .pipe(
            skipPropertyNull("a")
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

  it("should pass object with undefined", async function () {
    const testObj = {
      a: undefined as string | null | undefined,
      b: "b" as string,
    };

    const testObj$ = of(testObj);

    const completion = testObj$
    // functional test
        .pipe(
            skipPropertyNull("a")
        )
        // just for compiler check, a and b are strings
        .pipe(
            // tap(x => x.a.charAt(0)), //
            tap(x => x.b.charAt(0)),
        )
        .forEach(x => {
          assert.isUndefined(x.a);
        });

    await completion;
  });

});
