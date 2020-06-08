import { assert } from "chai";
import { of } from "rxjs";
import { tap } from "rxjs/operators";
import { skipNil } from "./skip-nil";
import { expectObservable, hot } from "../../spec/helpers/marble-testing";

declare function asDiagram(arg: string): Function;

describe("diagram skipNil", () => {
    asDiagram("skipNil()")("should skip all nil values", () => {
        // @formatter:off
        const e1 =   hot("-a-n-u-b|", {a: "a", n: null, u: undefined, b: "b"});
        const expected = "-a-----b|";
        // @formatter:on

        expectObservable(e1.pipe(skipNil())).toBe(expected);
    });
});

describe("skipNull", function () {

  it("should pass non null nor undefined values", async function () {
    const testValue = "x" as string | null | undefined;
    const testValue$ = of(testValue);

    const completion = testValue$
        .pipe(
            skipNil(),
            tap(x => x.charAt(0)) // compiler check
        )
        .forEach(x => {
          assert.equal(x, testValue);
        });

    await completion;
  });

  it("should filter null and undefined values", async function () {
    const testValue = null as string | null | undefined;
    const testValue$ = of(testValue);

    const completion = testValue$
        .pipe(
            skipNil(),
        )
        .forEach(x => {
          throw new Error(`shouldn't run here, x is '${x}'`);
        });

    await completion;
  });

});
