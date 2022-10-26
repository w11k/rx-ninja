import {assert} from "chai";
import {Subject} from "rxjs";
import {startWith} from "./start-with";


describe("startWith", function () {

    it("should call provider handler on subscribe", async () => {
        const subject = new Subject<number>();

        let providerCalled = false;
        const subscription = subject
          .pipe(
            startWith(() => {
                providerCalled = true;
                return 0;
            })
          )
          .subscribe({
            next: (value) => { assert.isTrue(value === 0); },
            complete: () => { throw new Error("no completion expected"); },
            error: () => { throw new Error("no error expected"); },
        });

        subscription.unsubscribe();

        assert.isTrue(providerCalled);
    });

    it("should deliver startWith value before regular event", async () => {
        const subject = new Subject<number>();
        const values: number[] = [];

        subject.next(-1);
        const subscription = subject
          .pipe(
            startWith(() => 0)
          )
          .subscribe({
              next: (value) => { values.push(value); },
              complete: () => { throw new Error("no completion expected"); },
              error: () => { throw new Error("no error expected"); },
          });

        subject.next(1);
        subscription.unsubscribe();

        assert.deepEqual(values, [0, 1]);
    });

});
