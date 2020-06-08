import { replayOn } from "./replay-on";
import { marbles } from "rxjs-marbles";
import { expectObservable, hot } from "../../spec/helpers/marble-testing";

declare function asDiagram(arg: string): Function;

describe("diagram replayOn", () => {
  asDiagram("replayOn(signal)")("should replay last value when signal emits", () => {
    // @formatter:off
    const e1 =      hot("a-b-c|");
    const trigger = hot("---1-|");
    const expected =    "a-bbc|";
    // @formatter:on

    expectObservable(e1.pipe(replayOn(trigger))).toBe(expected);
  });
});

describe("replayOn", () => {
  it("should pass values", marbles(m => {
    // @formatter:off
    const source =  m.cold("a-b-c|");
    const trigger = m.hot( "-----|");
    const output =  m.cold("a-b-c|");
    // æformatter:on
    const destination = source.pipe(replayOn(trigger));
    m.expect(destination).toBeObservable(output);
  }));

  it("should replay last value on signal", marbles( m => {
    // @formatter:off
    const source = m.cold("a-b--c-|");
    const trigger = m.hot("---1--1|");
    const output = m.cold("a-bb-cc|");
    // @formatter:on

    const destination = source.pipe(replayOn(trigger));
    m.expect(destination).toBeObservable(output);
  }));
});
