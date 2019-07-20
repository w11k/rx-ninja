import { Observable } from "rxjs";
import { mapTo, startWith, switchMap } from "rxjs/operators";

/**
 * Replays the last value of 'source' whenever 'signal' emits a value.
 *
 * source: -a---b---c---|
 * signal: ------1----2-|
 * result: -a---bb--c-c-|
 */
export function replayOn<T>(signal: Observable<any>) {
  return (source: Observable<T>) =>
      source.pipe(
          switchMap((value: T) =>
              signal.pipe(
                  mapTo(value),
                  startWith(value)
              ))
      );
}
