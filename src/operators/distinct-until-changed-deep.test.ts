import { marbles } from "rxjs-marbles";
import { distinctUntilChangedDeep } from "./distinct-until-changed-deep";

describe("distinctUntilChangedDeep", () => {
    it("should emit only once on same primitives", marbles(m => {
        // @formatter:off
        const source   = m.cold("a-a-a|");
        const expected = m.cold("a----|");
        // @formatter:on
        const destination = source.pipe(distinctUntilChangedDeep());
        m.expect(destination).toBeObservable(expected);
    }));

    it("should emit only once on equal objects", marbles((m) => {
        const a: any = {};
        a.foo = "bar";
        a.baz = {};

        const b = { baz: {}, foo: "bar" };
        // @formatter:off
        const source   = m.cold("a-b-a|", {a, b});
        const expected = m.cold("a----|", {a});
        // @formatter:on

        const destination = source.pipe(distinctUntilChangedDeep());
        m.expect(destination).toBeObservable(expected);
    }));
});
