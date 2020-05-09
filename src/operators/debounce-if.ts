import { Observable, of, SchedulerLike, timer } from "rxjs";
import { mapTo, pairwise, startWith, switchMap, take } from "rxjs/operators";

/**
 * Debounce values on the stream if the predicate returns true.
 *
 * @param debounceTimeInMs time to debounce in milliseconds
 * @param predicate called with previous and last value, when evaluates to true debounce
 * @param scheduler the scheduler
 */
export function debounceIf<T>(debounceTimeInMs: number,
                              predicate: (previous: T | undefined, last: T) => boolean,
                              scheduler?: SchedulerLike) {

  return function operateFunction(source: Observable<T>) {
    return source.pipe(
        startWith(undefined),
        pairwise(),
        switchMap(([prev, cur]) => {
          if (predicate(prev, cur!)) {
            return timer(debounceTimeInMs, scheduler).pipe(
                mapTo(cur),
                take(1),
            );
          }

          return of(cur);
        }),
    );
  };
}
