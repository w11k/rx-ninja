import { combineLatest, Observable, of, timer } from "rxjs";
import { filter, flatMap, map, mapTo, materialize, pairwise, startWith, switchMap, take } from "rxjs/operators";

export function entries<T>(obj: any): [string, T][] {
    const ownProps = Object.keys(obj);
    let i = ownProps.length;
    const resArray = new Array(i);

    while (i--) {
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }

    return resArray;
}

export function notNil<T>(x: T | null | undefined): x is T {
    return x !== null && x !== undefined;
}

export function isNil<T>(x: T | null | undefined): x is null | undefined {
    return x === null || x === undefined;
}

export function notNull<T>(x: T | null): x is T {
    return x !== null;
}

export function notUndefined<T>(x: T | undefined): x is T {
    return x !== undefined;
}

export const skipUndefined = <T>(source: Observable<T | undefined>) => {
    return source.pipe(filter(notUndefined));
};

export const skipNull = <T>(source: Observable<T | null>) => {
    return source.pipe(filter(notNull));
};

export const skipNil = <T>(source: Observable<T | null | undefined>) => {
    return source.pipe(filter(notNil));
};

type NonNull<T> = T extends null ? never : T;
type NonUndefined<T> = T extends undefined ? never : T;
type NonNil<T> = T extends null | undefined ? never : T;

export function propertiesNotNull<T>(obj: T): obj is { [P in keyof T]: NonNull<T[P]> } {
    const hasNull = entries(obj)
        .some(x => x[1] === null);

    return !hasNull;
}

export function propertyNotNull<T, P extends keyof T>(property: P) {
    return (obj: T): obj is { [X in keyof T]: X extends P ? NonNull<T[X]> : T[X] } => {
        const value = obj[property];

        return value !== null;
    };
}

export function propertiesNotUndefined<T>(obj: T): obj is { [P in keyof T]: NonUndefined<T[P]> } {
    const hasUndefined = entries(obj)
        .some(x => x[1] === undefined);

    return !hasUndefined;
}

export function propertyNotUndefined<T, P extends keyof T>(property: P) {
    return (obj: T): obj is { [X in keyof T]: X extends P ? NonNil<T[X]> : T[X] } => {
        const value = obj[property];

        return value !== undefined;
    };
}

export function propertiesNotNil<T>(obj: T): obj is { [P in keyof T]: NonNil<T[P]> } {
    const hasNil = entries(obj)
        .some(x => x[1] === null || x[1] === undefined);

    return !hasNil;
}

export function propertyNotNil<T, P extends keyof T>(property: P) {
    return (obj: T): obj is { [X in keyof T]: X extends P ? NonNil<T[X]> : T[X] } => {
        const value = obj[property];

        return value !== null && value !== undefined;
    };
}

export function skipSomePropertyNull<T>(source: Observable<T>) {
    return source.pipe(filter(propertiesNotNull));
}

export function skipPropertyNull<T, P extends keyof T>(prop: P) {
    return function (source: Observable<T>) {
        return source.pipe(filter(propertyNotNull(prop)));
    };
}

export function skipSomePropertyUndefined<T>(source: Observable<T>) {
    return source.pipe(filter(propertiesNotUndefined));
}

export function skipPropertyUndefined<T, P extends keyof T>(prop: P) {
    return function (source: Observable<T>) {
        return source.pipe(filter(propertyNotUndefined(prop)));
    };
}

export function skipSomePropertyNil<T>(source: Observable<T>) {
    return source.pipe(filter(propertiesNotNil));
}

export function skipPropertyNil<T, P extends keyof T>(prop: P) {
    return function (source: Observable<T>) {
        return source.pipe(filter(propertyNotNil(prop)));
    };
}


export function combineLatestToMap<T>(obsMap: { [P in keyof T]: Observable<T[P]> }): Observable<T> {
    const keys = Object.keys(obsMap);

    // ensure same order for values and keys
    const values$ = keys.map(key => (obsMap as any)[key]);

    return combineLatest(values$).pipe(map(values => {
        // try to get rid of any
        // const mapOfValues: {[P in keyof T]: T[P]} = {};
        const mapOfValues: any = {};

        keys.forEach((key, index) => {
            mapOfValues[key] = values[index];
        });

        return mapOfValues;
    }));
}

/**
 * Debounce values on the stream if the predicate returns true.
 */
export function debounceIf<T>(debounceTimeInMs: number,
                              predicate: (previous: T | undefined, last: T) => boolean) {

    return (source: Observable<T>) => source.pipe(
        startWith(undefined),
        pairwise(),
        switchMap(([prev, cur]) => {
            if (predicate(prev, cur)) {
                return timer(debounceTimeInMs).pipe(
                    mapTo(cur),
                    take(1)
                );
            }

            return of(cur);
        })
    );
}

/**
 * Replays the last value on the stream of 'input' whenever 'signal' emits a value.
 */
export function replayOn<T>(signal: Observable<any>) {
    return (input: Observable<T>) =>
        input.pipe(
            switchMap((value: T) =>
                signal.pipe(
                    mapTo(value),
                    startWith(value)
                ))
        );
}

/**
 */
export function onCompletionContinueWith<T, O>(continueWith: (lastValue: T) => Observable<O>) {
    let lastValue: T;
    return (input: Observable<T>) => {
        return input.pipe(
            materialize(),
            flatMap((value: any) => {
                if (value.kind === "N") {
                    lastValue = value.value!;
                    return value.toObservable();
                } else if (value.kind === "C") {
                    return continueWith(lastValue);
                } else {
                    return value.toObservable();
                }
            })
        );
    };
}

export function skipUntilCompletionAndContinueWith<T, O>(continueWith: () => Observable<O>): (input: Observable<T>) => Observable<O> {
    return (input: Observable<T>) => {
        return input.pipe(
          materialize(),
          filter((value: any) => value.kind === "C"),
          flatMap(() => continueWith()),
        );
    };
}
