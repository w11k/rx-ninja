import {marbles} from "rxjs-marbles/mocha";
import {rateLimitLossless, rateLimitLossy} from "./rate-limit";

describe("rate limit operator", () => {
  describe("rateLimitLossless", () => {
    it("should limit to 1 within 5", marbles((m) => {
      const count = 1;
      const window = 5;
      const source =   m.cold("abcd-------------");
      const expected = m.cold("a----b----c----d-");

      const result = source.pipe(rateLimitLossless(count, window, m.scheduler));
      m.expect(result).toBeObservable(expected);
    }));

    it("should limit to 2 in 4", marbles((m) => {
      const count = 2;
      const window = 4;
      const source =   m.cold("abc----------------");
      const expected = m.cold("ab--c--------------");

      const result = source.pipe(rateLimitLossless(count, window, m.scheduler));
      m.expect(result).toBeObservable(expected);
    }));

    it("should limit to 5 in 10", marbles((m) => {
      const count = 5;
      const window = 10;
      const source =   m.cold("abcdef-g------aa----");
      const expected = m.cold("abcde-----fg--aa----");

      const result = source.pipe(rateLimitLossless(count, window, m.scheduler));
      m.expect(result).toBeObservable(expected);
    }));
  });

  describe("rateLimitLossy", () => {
    it("should limit to 1 within 5", marbles((m) => {
      const count = 1;
      const window = 5;
      const source =   m.cold("ab----cd-");
      const expected = m.cold("a-----c--");

      const result = source.pipe(rateLimitLossy(count, window, m.scheduler));
      m.expect(result).toBeObservable(expected);
    }));

    it("should limit to 2 in 4", marbles((m) => {
      const count = 2;
      const window = 4;
      const source =   m.cold("abc-defg-");
      const expected = m.cold("ab---ef--");

      const result = source.pipe(rateLimitLossy(count, window, m.scheduler));
      m.expect(result).toBeObservable(expected);
    }));

    it("should limit to 5 in 10", marbles((m) => {
      const count = 5;
      const window = 10;
      const source =   m.cold("abcdef-g---h---aa----");
      const expected = m.cold("abcde------h---aa----");

      const result = source.pipe(rateLimitLossy(count, window, m.scheduler));
      m.expect(result).toBeObservable(expected);
    }));
  });
});
