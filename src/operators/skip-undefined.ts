import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

/**
 * Type guard checking a value is not undefined.
 * Narrows the type from T | undefined to just T.
 *
 * @param x value to check
 */
export function isNotUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

/**
 * Filters undefined values.
 * Narrows the type from Observable<T | undefined> to just Observable<T>.
 *
 * <img src="media://skipUndefined.png" alt="marble">
 */
export function skipUndefined<T>() {
  return function operatorFunction(source: Observable<T | undefined>) {
    return source.pipe(filter(isNotUndefined));
  };
}
