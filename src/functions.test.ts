import {assert} from "chai";
import {NEVER, Observable, of, Subject} from "rxjs";
import {map, take, tap} from "rxjs/operators";
import {
    debounceIf,
    entries,
    onCompletionContinueWith,
    replayOn,
    skipNil,
    skipNull,
    skipPropertyNil,
    skipPropertyNull,
    skipPropertyUndefined,
    skipSomePropertyNil,
    skipUndefined,
    skipUntilCompletionAndContinueWith
} from "./index";

describe("functions", function () {

    it("entries", function () {
        const obj = {
            a: 1,
            2: "b"
        };

        assert.notSameOrderedMembers(entries(obj), [
            ["a", 1],
            ["2", "b"],
        ]);
    });

    it("skipNull", function (done) {
        const testValue = "x" as string | null;
        const testValue$ = of(testValue);
        testValue$
            .pipe(
                skipNull,
                tap(x => x.charAt(0)) // compiler check
            )
            .subscribe(x => {
                assert.equal(x, testValue);
                done();
            });
    });

    it("skipUndefined", function (done) {
        const testValue = "x" as string | undefined;
        const testValue$ = of(testValue);
        testValue$
            .pipe(
                skipUndefined,
                tap(x => x.charAt(0)) // compiler check
            )
            .subscribe(x => {
                assert.equal(x, testValue);
                done();
            });
    });

    it("skipNil", function (done) {
        const testValue = "x" as string | undefined | null;
        const testValue$ = of(testValue);
        testValue$
            .pipe(
                skipNil,
                tap(x => x.charAt(0)) // compiler check
            )
            .subscribe(x => {
                assert.equal(x, testValue);
                done();
            });
    });


    it("todo", function () {
        const testObj = {
            a: "a" as string | null,
            b: "b" as string | undefined,
            c: "c" as string | undefined | null,
            d: "d" as string,
            // d: 'd' as string | undefined,
        };

        const testObj$ = of(testObj);

        testObj$
            .pipe(skipPropertyNull("a"))
            .pipe(skipPropertyUndefined("b"))
            .pipe(skipPropertyNil("c"))
            .pipe(tap(x => x.a.charAt(0)))
            .pipe(tap(x => x.b.charAt(0)))
            .pipe(tap(x => x.c.charAt(0)))
            .pipe(tap(x => x.d.charAt(0)))
        ;

        testObj$
            .pipe(skipSomePropertyNil)
            .pipe(tap(x => x.a.charAt(0)))
            .pipe(tap(x => x.b.charAt(0)))
            .pipe(tap(x => x.c.charAt(0)))
            .pipe(tap(x => x.d.charAt(0)))
        ;
    });

});

describe("debounceIf", function () {

    it("does not debounce if the predicate returns false", function () {
        const source = of(1, 2);
        const values: any[] = [];
        source.pipe(
            debounceIf(1000, () => false)
        ).subscribe(value => {
            values.push(value);
        });
        assert.deepEqual(values, [1, 2]);
    });

    it("debounces if the predicate returns true", function (done) {
        const source = of(1, 2);

        let async = false;
        let called = 0;
        source.pipe(
            debounceIf(0, (prev, cur) => {
                if (called === 0) {
                    assert.isUndefined(prev);
                    assert.equal(cur, 1);
                } else if (called === 1) {
                    assert.equal(prev, 1);
                    assert.equal(cur, 2);
                }

                called++;
                return true;
            })
        ).subscribe(value => {
            assert.isTrue(async);
            assert.equal(called, 2);
            assert.equal(value, 2);
            done();
        });
        async = true;
    });

});

describe("replayOn", function () {

    it("passes values", function () {
        const source = of(1, 2);
        const trigger = new Subject();
        const values: any[] = [];
        source.pipe(
            replayOn(trigger)
        ).subscribe(value => {
            values.push(value);
        });
        assert.deepEqual(values, [1, 2]);
    });

    it("replays last value on signal", function () {
        const source = new Subject<number>();
        const trigger = new Subject();
        const values: any[] = [];
        source.pipe(
            replayOn(trigger)
        ).subscribe(value => {
            values.push(value);
        });

        source.next(1);
        source.next(2);
        trigger.next();
        source.next(3);
        trigger.next();

        assert.deepEqual(values, [1, 2, 2, 3, 3]);
    });

});

describe("onCompletionContinueWith", function () {

    it("mirrors source", function () {
        const start = of(1, 2, 3);
        const continueWith = of();

        const values: any[] = [];
        start.pipe(
            onCompletionContinueWith(() => continueWith)
        ).subscribe(value => values.push(value));

        assert.deepEqual(values, [1, 2, 3]);
    });

    it("continueWithFn is called with last emitted value", function (done) {
        const start = of(1, 2, 3);

        start.pipe(
            onCompletionContinueWith((lastValue) => {
                assert.equal(lastValue, 3);
                done();
                return NEVER;
            })
        ).subscribe();
    });

    it("continues with return observable", function () {
        const start = of(1, 2, 3);

        const values: any[] = [];
        start.pipe(
            onCompletionContinueWith(() => {
                return of(4, 5, 6);
            })
        ).subscribe(value => values.push(value));
        assert.deepEqual(values, [1, 2, 3, 4, 5, 6]);
    });

    it("does not call continueWithFn if observer unsubscribes early", function () {
        const start = of(1, 2, 3);

        let continueWithFnCalled = false;
        start.pipe(
            onCompletionContinueWith(() => {
                continueWithFnCalled = true;
                return NEVER;
            })
        ).pipe(take(3)).subscribe();

        assert.isFalse(continueWithFnCalled);
    });

});

describe("skipUntilCompletionAndContinueWith", () => {

    it("should return values of second observable if first has completed", () => {
        const first$: Observable<number> = of(1, 2, 3);
        const second$: Observable<string> = of("Hello World!");

        const values: Array<number | string> = [];

        first$.pipe(
            skipUntilCompletionAndContinueWith(() => second$)
        ).subscribe((value: string) => {
            values.push(value);
        });

        assert.deepEqual(values, ["Hello World!"]);
    });

    it("should continue even if first observable crashes", (done) => {
        const first$ = of(1, 2, 3);
        const second$ = of("foo");

        first$.pipe(
            map((v) => {
                if (v === 2) {
                    throw new Error("ERROR");
                } else {
                    return v;
                }
            }),
            skipUntilCompletionAndContinueWith(() => second$)
        ).subscribe((value => {
            assert.equal(value, "foo");
        }), () => {
            assert.fail("", "", "Should not end here!");
        }, () => {
            done();
        });
    });

    it("should work with second observable emitting multiple values", () => {
        const first$: Observable<number> = of(1, 2, 3);
        const second$: Observable<string> = of("Hello World!", "Hi again!");

        const values: Array<number | string> = [];

        first$.pipe(
            skipUntilCompletionAndContinueWith(() => second$)
        ).subscribe((value: string) => {
            values.push(value);
        });

        assert.deepEqual(values, ["Hello World!", "Hi again!"]);
    });

});
