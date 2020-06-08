import { debounceIf } from "./debounce-if";
import { marbles } from "rxjs-marbles";
import { TestScheduler } from "rxjs/testing";
import { expectObservable, hot } from "../../spec/helpers/marble-testing";

declare function asDiagram(arg: string): Function;

declare const rxTestScheduler: TestScheduler;

describe("diagram debounceIf", () => {
  asDiagram("debounceIf(20, n => n % 2 === 0)")("should debounce only even values", () => {
    // @formatter:off
    const e1 =   hot("-1--2---3--|");
    const expected = "-1----2-3--|";
    // @formatter:on

    expectObservable(e1.pipe(debounceIf(20, isEven, rxTestScheduler))).toBe(expected);
  });
});


describe("debounceIf", () => {

  it("should not debounce and emit values, when predicate evaluates to false", marbles(m => {
    // @formatter:off
    const source =         m.cold("-1--2--3|");
    const expectedOutput = m.cold("-1--2--3|");
    // @formatter:on
    const destination = source.pipe(debounceIf(m.time("--|"), () => false, m.scheduler));
    m.expect(destination).toBeObservable(expectedOutput);
  }));

  it("should debounce every value by one frame, when predicate evaluates to true", marbles(m => {
    // @formatter:off
    const source =         m.cold("1-2-(3|)");
    const expectedOutput = m.cold("-1-2-(3|)");
    // @formatter:on
    const destination = source.pipe(debounceIf(m.time("-|"), () => true, m.scheduler));
    m.expect(destination).toBeObservable(expectedOutput);
  }));

  it("should debounce only even values", marbles(m => {
    // @formatter:off
    const source =         m.cold("1-2-(3|)");
    const expectedOutput = m.cold("1--2(3|)");
    // @formatter:on
    const destination = source.pipe(debounceIf(m.time("-|"), isEven, m.scheduler));
    m.expect(destination).toBeObservable(expectedOutput);
  }));
});

export function isEven(prev: string | undefined, s: string): boolean {
  return (+s) % 2 === 0;
}
