import { assert } from "chai";
import { of } from "rxjs";
import { first, tap } from "rxjs/operators";
import { isPropertyNotNil, skipPropertyNil } from "./skip-property-nil";
import { expectObservable, hot } from "../../spec/helpers/marble-testing";

declare function asDiagram(arg: string): Function;

describe("diagram skipPropertyNil", () => {
    asDiagram(`skipPropertyNil(b)`)("should skip values when property b null or undefined", () => {
        const a = { a: 1, b: 2 };
        const b = { a: 1, b: null };
        const c = { a: 1, b: undefined };
        // @formatter:off
        const e1 =   hot("a-b-c-a|", {a, b, c});
        const expected = "a-----a|";
        // @formatter:on

        expectObservable(e1.pipe(skipPropertyNil("b"))).toBe(expected, { a });
    });
});

describe("isPropertyNotNil", function () {
  it("can be used with Array#filter", () => {
    const values = [{
      a: 1 as number | null | undefined
    }];

    values
        .filter(isPropertyNotNil("a"))
        .forEach(val => val.a.toExponential());

  });
});

describe("skipPropertyNil", function () {

  it("should should pass object with just values", async function () {
    const testObj = {
      a: "a" as string | null | undefined,
      b: "b" as string,
    };

    const testObj$ = of(testObj);

    const completion = testObj$
    // functional test
        .pipe(
            skipPropertyNil("a"),
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
      a: null as string | null | undefined,
      b: "b" as string,
    };

    const testObj$ = of(testObj);

    const completion = testObj$
        // functional test
        .pipe(
            skipPropertyNil("a")
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

  it("should filter object with undefined", async function () {
    const testObj = {
      a: undefined as string | null | undefined,
      b: "b" as string,
    };

    const testObj$ = of(testObj);

    const completion = testObj$
    // functional test
        .pipe(
            skipPropertyNil("a")
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

});
