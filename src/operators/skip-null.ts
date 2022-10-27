import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

/**
 * Type guard checking a value is not null.
 * Narrows the type from T | null to just T.
 *
 * @param val value to check
 */
export function isNotNull<T>(val: T | null): val is T {
  return val !== null;
}

/**
 * Skips / filters null values.
 * Narrows the type from Observable<T | null> to just Observable<T>.
 *
 * <img src="media://skip-null.svg" alt="marble">
 *
 * @param source observable to operate on
 */
export function skipNull() {
  return function <T>(source: Observable<T | null>) {
    return source.pipe(filter(isNotNull));
  };
}
