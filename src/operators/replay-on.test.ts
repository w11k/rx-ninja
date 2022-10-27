import { replayOn } from "./replay-on";
import { marbles } from "rxjs-marbles";

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
