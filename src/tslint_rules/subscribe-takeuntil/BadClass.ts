import {NEVER, of} from "rxjs";
import {map, takeUntil} from "rxjs/operators";

class SomeClass {
    subscribe() {
    }
}

// Error
of(1).pipe(map(i => i)).subscribe();

function test() {
    // Error
    of(1).pipe(map(i => i)).subscribe();
}

declare const scoped: any;
declare const untilComponentDestroyed: any;

class BadClass {

    observable = of(1);
    stop = of(1);

    constructor() {
        // Error
        of(1).pipe(
            map(i => i),
            takeUntil(this.stop),
            map(i => i),
        ).subscribe();

        // Error
        this.observable.pipe(
            map(i => i),
        ).subscribe();

        // Error
        this.observable.pipe().subscribe();

        // Error
        this.observable.subscribe();

        // Error
        this.observable.lift(scoped()).subscribe();

        // OK
        this.observable.pipe(
            map(i => i),
            takeUntil(this.stop),
        ).subscribe();

        // OK
        this.observable.pipe(
            map(i => i),
            takeUntil(NEVER),
        ).subscribe();

        // OK
        new SomeClass().subscribe();

        // Ok
        // tslint:disable-next-line:w11k-rxjs-subscribe-takeuntil
        of(1).pipe(map(i => i)).subscribe();
    }

}
