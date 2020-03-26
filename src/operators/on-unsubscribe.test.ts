import { Subject, Observable } from "rxjs";
import { onUnsubscribe } from "./on-unsubscribe";
import { expect, assert } from "chai";

describe("Observable", function () {

  it("should not call completion handler on early unsubscribe", async () => {
    const subject = new Subject<number>();

    const subscription = subject.subscribe({
        next: () => { throw new Error('no next value expected'); },
        complete: () => { throw new Error('no completion expected'); },
        error: () => { throw new Error('no error expected'); },
    });

    subscription.unsubscribe();

    subject.next(1);
    subject.complete();
  });

    it("should call teardown logic on completion", async () => {
        let teardownCalled = false;
        let completeCalled = false;

        const observable = new Observable(subscriber => {

            subscriber.complete();

            return () => {
                teardownCalled = true
            };
        });


        const subscription = observable.subscribe({
            next: () => { throw new Error('no next value expected'); },
            complete: () => { completeCalled = true },
            error: () => { throw new Error('no error expected'); },
        });

        assert.isTrue(completeCalled);
        assert.isTrue(teardownCalled);
    });

});

describe("onUnsubscribe", function () {

    it("should call teardown handler on early unsubscribe", async () => {
        const subject = new Subject<number>();

        let teardownCalled = false;
        const subscription = subject
          .pipe(
            onUnsubscribe(() => teardownCalled = true)
          )
          .subscribe({
            next: () => { throw new Error('no next value expected'); },
            complete: () => { throw new Error('no completion expected'); },
            error: () => { throw new Error('no error expected'); },
        });

        subscription.unsubscribe();

        assert.isTrue(teardownCalled);
    });

    it("should call teardown handler on completion", async () => {
        const subject = new Subject<number>();

        let teardownCalled = false;
        let completeCalled = false;
        const subscription = subject
          .pipe(
            onUnsubscribe(() => teardownCalled = true)
          )
          .subscribe({
              next: () => { throw new Error('no next value expected'); },
              complete: () => { completeCalled = true },
              error: () => { throw new Error('no error expected'); },
          });

        subject.complete();

        assert.isTrue(teardownCalled);
        assert.isTrue(completeCalled);
    });

  it("should call teardown handler on error", async () => {
    const subject = new Subject<number>();

    let teardownCalled = false;
    let errorCalled = false;
    const subscription = subject
      .pipe(
        onUnsubscribe(() => teardownCalled = true)
      )
      .subscribe({
        next: () => { throw new Error('no next value expected'); },
        complete: () => { throw new Error('no completion expected'); },
        error: () => { errorCalled = true; },
      });

    subject.error('error');

    assert.isTrue(teardownCalled);
    assert.isTrue(errorCalled);
  });

});
