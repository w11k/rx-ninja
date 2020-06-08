import { assert } from "chai";
import { of } from "rxjs";
import { marbles } from "rxjs-marbles/mocha";
import { tap } from "rxjs/operators";
import { skipNull } from "./skip-null";
import { expectObservable, hot } from "../../spec/helpers/marble-testing";

declare function asDiagram(arg: string): Function;

describe("diagram skipNull", () => {
    asDiagram("skipNull()")("should skip all null values", () => {
        // @formatter:off
        const e1 =   hot("-a-n-b|", {a: "a", n: null, b: "b"});
        const expected = "-a---b|";
        // @formatter:on

        expectObservable(e1.pipe(skipNull())).toBe(expected);
    });
});

describe("skipNull", function () {

  it("should pass non null values", async function () {
    const testValue = "x" as string | null;
    const testValue$ = of(testValue);

    const completion = testValue$
        .pipe(
            skipNull(),
            tap(x => x.charAt(0)) // compiler check
        )
        .forEach(x => {
          assert.equal(x, testValue);
        });

    await completion;
  });

  it("should filter null values", async function () {
    const testValue = null as string | null;
    const testValue$ = of(testValue);

    const completion = testValue$
        .pipe(
            skipNull(),
        )
        .forEach(x => {
          throw new Error(`shouldn't run here, x is '${x}'`);
        });

    await completion;
  });

    it("should filter null values", marbles(m => {
        const sourceMarble = "-a-b-c-|";
        const outputMarble = "---d---|";

        const a = null;
        const b = 2;
        const c = null;
        const d = 2;

        const source = m.cold<number | null>(sourceMarble, { a, b, c });
        const output = m.cold<number>(outputMarble, { d });

        const testee = source.pipe(skipNull());

        m.expect(testee).toBeObservable(output);
    }))

});
