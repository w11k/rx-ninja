import * as assert from "assert";
import {ReplaySubject, Subject} from "rxjs";
import {map} from "rxjs/operators";
import {createTransformingSubject} from "./transforming-subject";

describe("TransformingSubject", function () {

    it("the underlying Subject implementation can be changed", function () {
        const cs = createTransformingSubject(new ReplaySubject<number>(1), i => i);
        cs.next(1);
        const values: any[] = [];
        cs.subscribe(val => values.push(val));
        cs.next(2);
        assert.deepStrictEqual(values, [1, 2]);
    });

    it("the output stream can be transformed", function () {
        const cs = createTransformingSubject(new Subject<number>(), ($) => $.pipe(map(v => "-" + v)));
        const values: any[] = [];
        cs.subscribe((val: string) => values.push(val));
        cs.next(1);
        cs.next(2);
        assert.deepStrictEqual(values, ["-1", "-2"]);
    });

});
