import { Observable } from "rxjs";
import { flatMap, materialize } from "rxjs/operators";

/**
 * The resulting observable first emits all values from source observable.
 * On completion of source the given continueWith function will be called and returns another observable.
 * Resulting observable continues with emitted values of this observable provided by the continueWith function.
 *
 * source:                 -a-b-c-|
 * return of continueWith:        --d-e-f-|
 * result:                 -a-b-c---d-e-f-|
 *
 * @param continueWith function that delivers an observable to continue with
 */
export function onCompletionContinueWith<T, O>(continueWith: (lastValue: T) => Observable<O>) {
  return function (source: Observable<T>): Observable<T | O> {
    let lastValue: T;

    return source.pipe(
        materialize(),
        flatMap((notification): Observable<T | O> => {
          if (notification.kind === "N") {
            lastValue = notification.value!;
            return notification.toObservable();
          } else if (notification.kind === "C") {
            return continueWith(lastValue);
          } else {
            return notification.toObservable();
          }
        })
    );
  };
}
