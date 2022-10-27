import {NEVER, Observable, of} from "rxjs";
import {map, takeUntil} from "rxjs/operators";


const customTerminator = () => <T>(source: Observable<T>) => {
    return source.pipe(takeUntil(NEVER));
};


class SubscribeTakeuntilConfigRelevant {

    observable = of(1);
    stop = of(1);

    constructor() {
        // Error
        of(1).pipe(
            map(i => i),
            takeUntil(this.stop),
            map(i => i),
        ).subscribe();

        // OK
        this.observable.pipe(
            map(i => i),
            customTerminator(),
        ).subscribe();
    }

}
