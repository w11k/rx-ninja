import { Observable } from "rxjs";
import { mapTo, startWith, switchMap } from "rxjs/operators";

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
