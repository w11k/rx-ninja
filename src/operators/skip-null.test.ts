import { assert } from "chai";
import { of } from "rxjs";
import { tap } from "rxjs/operators";
import { skipNull } from "./skip-null";

describe("skipNull", function () {

  it("should pass non null values", async function () {
    const testValue = "x" as string | null;
    const testValue$ = of(testValue);

    const completion = testValue$
        .pipe(
            skipNull,
            tap(x => x.charAt(0)) // compiler check
        )
        .forEach(x => {
          assert.equal(x, testValue);
        });

    await completion;
  });

  it("should filter null values", async function () {
    const testValue = null as string | null;
    const testValue$ = of(testValue);

    const completion = testValue$
        .pipe(
            skipNull,
        )
        .forEach(x => {
          throw new Error(`shouldn't run here, x is '${x}'`);
        });

    await completion;
  });

});
