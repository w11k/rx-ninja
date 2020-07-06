import { Observable } from "rxjs";
import { filter, materialize, takeUntil } from "rxjs/operators";

/**
 * Behaves like rxjs's takeUntil operator but listens for completion of the notifier instead of next.
 *
 * <img src="media://take-until-completion.svg" alt="marble">
 *
 * @param notifier
 */
export function takeUntilCompletion<T>(notifier: Observable<any>) {
  const terminator = notifier.pipe(
      materialize(),
      filter(x => x.kind === "C"),
  );
  return function operatorFunction(source: Observable<T>) {
    return source.pipe(takeUntil(terminator));
  };
}
