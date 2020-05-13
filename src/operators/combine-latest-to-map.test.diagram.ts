import { combineLatestToMap } from "./combine-latest-to-map";
import { cold, expectObservable } from "../../spec/helpers/marble-testing";

declare function asDiagram(arg: string): Function;

describe("combineLatestToMap", function () {
    asDiagram("combineLatestToMap")("should behave like diagram in documentation example", () => {
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
