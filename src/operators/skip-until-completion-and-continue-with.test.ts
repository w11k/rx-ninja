import { Observable, of } from "rxjs";
import { assert } from "chai";
import { map } from "rxjs/operators";
import { skipUntilCompletionAndContinueWith } from "./skip-until-completion-and-continue-with";

describe("skipUntilCompletionAndContinueWith", () => {

  it("should return values of second observable if first has completed", () => {
    const first$: Observable<number> = of(1, 2, 3);
    const second$: Observable<string> = of("Hello World!");

    const values: Array<number | string> = [];

    first$.pipe(
        skipUntilCompletionAndContinueWith(() => second$)
    ).subscribe((value: string) => {
      values.push(value);
    });

    assert.deepEqual(values, ["Hello World!"]);
  });

  it("should continue even if first observable crashes", (done) => {
    const first$ = of(1, 2, 3);
    const second$ = of("foo");

    first$.pipe(
        map((v) => {
          if (v === 2) {
            throw new Error("ERROR");
          } else {
            return v;
          }
        }),
        skipUntilCompletionAndContinueWith(() => second$)
    ).subscribe((value => {
      assert.equal(value, "foo");
    }), () => {
      assert.fail("", "", "Should not end here!");
    }, () => {
      done();
    });
  });

  it("should work with second observable emitting multiple values", () => {
    const first$: Observable<number> = of(1, 2, 3);
    const second$: Observable<string> = of("Hello World!", "Hi again!");

    const values: Array<number | string> = [];

    first$.pipe(
        skipUntilCompletionAndContinueWith(() => second$)
    ).subscribe((value: string) => {
      values.push(value);
    });

    assert.deepEqual(values, ["Hello World!", "Hi again!"]);
  });

});
