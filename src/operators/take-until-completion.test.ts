import { assert } from "chai";
import { Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { takeUntilCompletion } from "./take-until-completion";

describe("takeUntilCompletion", function () {

  it("should terminate subscription on notifier completion", async function () {
    const testValue$ = new Subject<string>();
    const notifier = new Subject<void>();
    let lastValue: string | undefined = undefined;

    const completion = testValue$
        .pipe(
            takeUntilCompletion(notifier),
            tap(x => x.charAt(0)) // compiler check
        )
        .forEach(x => lastValue = x);

    testValue$.next("A");
    notifier.complete();
    testValue$.next("B");

    await completion;

    assert.equal(lastValue, "A");
  });

  it("should not terminate subscription on notifier next", async function () {
    const testValue$ = new Subject<string>();
    const notifier = new Subject<void>();
    let lastValue: string | undefined = undefined;

    const completion = testValue$
        .pipe(
            takeUntilCompletion(notifier),
            tap(x => x.charAt(0)) // compiler check
        )
        .forEach(x => lastValue = x);

    testValue$.next("A");
    notifier.next();
    testValue$.next("B");
    testValue$.complete();

    await completion;

    assert.equal(lastValue, "B");
  });

});
