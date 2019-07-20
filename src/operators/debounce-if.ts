import { Observable, of, SchedulerLike, timer } from "rxjs";
import { mapTo, pairwise, startWith, switchMap, take } from "rxjs/operators";

/**
 * Debounce values on the stream if the predicate returns true.
 */
export function debounceIf<T>(debounceTimeInMs: number,
                              predicate: (previous: T | undefined, last: T) => boolean,
                              scheduler?: SchedulerLike) {

  return (source: Observable<T>) => source.pipe(
      startWith(undefined),
      pairwise(),
      switchMap(([prev, cur]) => {
        if (predicate(prev, cur)) {
          return timer(debounceTimeInMs, scheduler).pipe(
              mapTo(cur),
              take(1)
          );
        }

        return of(cur);
      })
  );
}
