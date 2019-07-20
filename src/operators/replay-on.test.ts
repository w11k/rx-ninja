import { of, Subject } from "rxjs";
import { assert } from "chai";
import { replayOn } from "./replay-on";

describe("replayOn", function () {

  it("should pass values", async function () {
    const source = of(1, 2);
    const trigger = new Subject();
    const values: any[] = [];

    const completion = source.pipe(
        replayOn(trigger)
    ).forEach(value => {
      values.push(value);
    });

    trigger.complete();

    await completion;

    assert.deepEqual(values, [1, 2]);
  });

  it("should replay last value on signal", async function () {
    const source = new Subject<number>();
    const trigger = new Subject();

    const values: any[] = [];

    const completion = source.pipe(
        replayOn(trigger)
    ).forEach(value => {
      values.push(value);
    });

    source.next(1);
    source.next(2);
    trigger.next();
    source.next(3);
    trigger.next();

    source.complete();
    trigger.complete();

    await completion;

    assert.deepEqual(values, [1, 2, 2, 3, 3]);
  });

});
