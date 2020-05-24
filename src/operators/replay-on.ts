import { Observable } from "rxjs";
import { mapTo, startWith, switchMap } from "rxjs/operators";

/**
 * Replays the last value of 'source' whenever 'signal' emits a value.
 *
 * <img src="media://replayOn.png" alt="marble">
 *
 * ```
 * source: -a---b---c---|
 * signal: ------1----2-|
 * result: -a---bb--c-c-|
 * ```
 *
 * @param signal trigger observable to replay value of source
 */
export function replayOn<T>(signal: Observable<any>) {
  return function operateFunction(source: Observable<T>) {
      return source.pipe(
          switchMap((value: T) =>
              signal.pipe(
                  mapTo(value),
                  startWith(value)
              ))
      );
  };
}
