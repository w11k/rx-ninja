import { NEVER, of } from "rxjs";
import { assert } from "chai";
import { take } from "rxjs/operators";
import { onCompletionContinueWith } from "./on-completion-continue-with";

describe("onCompletionContinueWith", function () {

  it("should mirror source", async function () {
    const start = of(1, 2, 3);
    const continueWith = of();

    const values: any[] = [];
    const completion = start.pipe(
        onCompletionContinueWith(() => continueWith)
    ).forEach(value => values.push(value));

    await completion;

    assert.deepEqual(values, [1, 2, 3]);
  });

  it("should call continueWithFn with last emitted value", function (done) {
    const start = of(1, 2, 3);

    start.pipe(
        onCompletionContinueWith((lastValue) => {
          assert.equal(lastValue, 3);
          done();
          return NEVER;
        })
    ).subscribe();
  });

  it("should continue with return observable", async function () {
    const start = of(1, 2, 3);

    const values: any[] = [];
    const completion = start.pipe(
        onCompletionContinueWith(() => {
          return of(4, 5, 6);
        })
    ).forEach(value => values.push(value));

    await completion;

    assert.deepEqual(values, [1, 2, 3, 4, 5, 6]);
  });

  it("should not call continueWithFn if observer unsubscribes early", async function () {
    const start = of(1, 2, 3);

    let continueWithFnCalled = false;
    const completion = start
        .pipe(
            onCompletionContinueWith(() => {
              continueWithFnCalled = true;
              return NEVER;
            })
        )
        .pipe(take(3)).forEach(() => {
        });

    await completion;

    assert.isFalse(continueWithFnCalled);
  });

});
