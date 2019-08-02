import { assert } from "chai";
import { of } from "rxjs";
import { tap } from "rxjs/operators";
import { skipUndefined } from "./skip-undefined";

describe("skipUndefined", function () {

  it("should pass non undefined values", async function () {
    const testValue = "x" as string | undefined;
    const testValue$ = of(testValue);

    const completion = testValue$
        .pipe(
            skipUndefined,
            tap(x => x.charAt(0)) // compiler check
        )
        .forEach(x => {
          assert.equal(x, testValue);
        });

    await completion;
  });

  it("should filter undefined values", async function () {
    const testValue = undefined as string | undefined;
    const testValue$ = of(testValue);

    const completion = testValue$
        .pipe(
            skipUndefined,
        )
        .forEach(x => {
          throw new Error(`shouldn't run here, x is '${x}'`);
        });

    await completion;
  });

});
