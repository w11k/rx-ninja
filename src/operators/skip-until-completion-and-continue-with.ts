import { Observable } from "rxjs";
import { filter, flatMap, materialize } from "rxjs/operators";

/**
 * On completion of source observable the given continueWith function will be called and
 * the resulting observable will emit its values. Does not emit values of the source.
 *
 * source:                 -a-b-c-|
 * return of continueWith:        --d-e-f-|
 * result:                 ---------d-e-f-|
 *
 * If you also need the values from source, use onCompletionContinueWith.
 *
 * @param continueWith function that delivers an observable to continue with
 */
export function skipUntilCompletionAndContinueWith<T, O>(continueWith: () => Observable<O>): (input: Observable<T>) => Observable<O> {
  return function (input: Observable<T>) {
    return input.pipe(
        materialize(),
        filter((value: any) => value.kind === "C"),
        flatMap(() => continueWith()),
    );
  };
}
