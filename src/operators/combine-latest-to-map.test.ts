import { marbles } from "rxjs-marbles/mocha";
import { combineLatestToMap } from "./combine-latest-to-map";
import { cold, expectObservable } from "../../spec/helpers/marble-testing";

declare function asDiagram(arg: string): Function;

describe("diagram combineLatestToMap", function () {
    asDiagram("combineLatestToMap()")("should behave like diagram in documentation example", () => {
        const marbleA = "-a---b---c--|";
        const marbleB = "---d---e---f---|";
        const marbleR = "---g-h-i-j-k---|";

        const g = { A: "a", B: "d" };
        const h = { A: "b", B: "d" };
        const i = { A: "b", B: "e" };
        const j = { A: "c", B: "e" };
        const k = { A: "c", B: "f" };

        const sourceA = cold<string>(marbleA);
        const sourceB = cold<string>(marbleB);

        const destination = combineLatestToMap({ A: sourceA, B: sourceB });

        expectObservable(destination).toBe(marbleR, { g, h, i, j, k });
    });
});


describe("combineLatestToMap", function () {
    it("should never emit result on empty sources", marbles(m => {
        const sourceA = m.cold<number>("|");
        const sourceB = m.cold<string>("|");

        const expected = m.cold<{ sA: number, sB: string }>("|");

        const destination = combineLatestToMap({ sA: sourceA, sB: sourceB });
        m.expect(destination).toBeObservable(expected);
    }));

    it("should never emit result when at least on observable completes without data", marbles(m => {
        const sourceA = m.cold<number>("-a|");
        const sourceB = m.cold<string>("-b|");
        const sourceC = m.cold<string>("--|");

        const expected = m.cold<{ sA: number, sB: string, sC: string }>("--|");

        const destination = combineLatestToMap({ sA: sourceA, sB: sourceB, sC: sourceC });
        m.expect(destination).toBeObservable(expected);
    }));


    it("should emit when all sources have emitted a value", marbles(m => {
        const sourceA = m.cold<number>("-a|", { a: 1 });
        const sourceB = m.cold<string>("-b|", { b: "foo" });
        const sourceC = m.cold<string>("-c|", { c: "bar" });

        const expected = m.cold<{ sA: number, sB: string, sC: string }>("-d|", { d: { sA: 1, sB: "foo", sC: "bar" } });

        const destination = combineLatestToMap({ sA: sourceA, sB: sourceB, sC: sourceC });
        m.expect(destination).toBeObservable(expected);
    }));

    it("should emit new values as soon as one source observable emits a value", marbles(m => {
        const marbleA = "-a-b|";
        const marbleB = "-c|"; // not all observables have to be alive the exact number of frames
        const marbleR = "-d-e|";

        const a = 1;
        const b = 2;
        const c = "foo";
        const d = { sA: 1, sB: "foo" };
        const e = { sA: 2, sB: "foo" };

        const sourceA = m.cold<number>(marbleA, { a, b });
        const sourceB = m.cold<string>(marbleB, { c });

        const expected = m.cold<{ sA: number, sB: string }>(marbleR, { d, e });
        const destination = combineLatestToMap({ sA: sourceA, sB: sourceB });
        m.expect(destination).toBeObservable(expected);
    }));

    it("should behave like diagram in documentation example", marbles(m => {
        const marbleA = "-a---b---c--|";
        const marbleB = "---d---e---f---|";
        const marbleR = "---g-h-i-j-k---|";

        const g = { A: "a", B: "d" };
        const h = { A: "b", B: "d" };
        const i = { A: "b", B: "e" };
        const j = { A: "c", B: "e" };
        const k = { A: "c", B: "f" };

        const sourceA = m.cold<string>(marbleA);
        const sourceB = m.cold<string>(marbleB);

        const expected = m.cold<{ A: string, B: string }>(marbleR, { g, h, i, j, k });

        const destination = combineLatestToMap({ A: sourceA, B: sourceB });
        m.expect(destination).toBeObservable(expected);
    }));
});
