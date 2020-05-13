import { Observable, of, SchedulerLike, timer } from "rxjs";
import { mapTo, pairwise, startWith, switchMap, take } from "rxjs/operators";

/**
 * Debounce values on the stream if the predicate returns true.
 *
 * <img src="media://debounceIf.png" alt="marble">
 *
 * Examples:
 *
 * Example 1
 *
 * debounceTimeInMs: don't matter in this example
 * predicate: `() => false`
 *
 * ```
 * source: 1-2-3|
 * result: 1-2-3|
 * ```
 *
 * ------------------------------------------------------------------
 *
 * Example 2
 *
 * 10ms equals 1 frame
 * debounceTimeInMs: `10`
 * predicate: `() => true`
 *
 * ```
 * source: 1-2-3|
 * result: -1-2-3|
 * ```
 *
 * ------------------------------------------------------------------
 *
 * Example 3
 * Debounce only on even values
 *
 * 10ms equals 1 frame
 * debounceTimeInMs: `10`
 * predicate: `(_, a) => a % 2 === 0`
 *
 * ```
 * source: 1-2-(3|)
 * result: 1--2(3|)
 * ```
 *
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
