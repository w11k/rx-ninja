import { of } from "rxjs";
import { assert } from "chai";
import { debounceIf } from "./debounce-if";

// TODO: improve async tests, use promises or switch to TestScheduler

describe("debounceIf", function () {

  it("should emit values immediately if the predicate returns false", async function () {
    const source = of(1, 2);

    const values: any[] = [];
    const completion = source
        .pipe(
            debounceIf(1000, () => false)
        )
        .forEach(value => {
          values.push(value);
        });

    await completion;

    assert.deepEqual(values, [1, 2]);
  });

  it("should debounce if the predicate returns true", function (done) {
    const source = of(1, 2);

    let async = false;
    let called = 0;
    source.pipe(
        debounceIf(0, (prev, cur) => {
          if (called === 0) {
            assert.isUndefined(prev);
            assert.equal(cur, 1);
          } else if (called === 1) {
            assert.equal(prev, 1);
            assert.equal(cur, 2);
          }

          called++;
          return true;
        })
    ).subscribe(value => {
      assert.isTrue(async);
      assert.equal(called, 2);
      assert.equal(value, 2);
      done();
    });
    async = true;
  });

});
