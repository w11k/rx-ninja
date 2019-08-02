import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

/**
 * Type guard checking a value is not undefined.
 * Narrows the type from T | undefined to just T.
 *
 * @param x value to check
 */
export function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

/**
 * Filters undefined values.
 * Narrows the type from Observable<T | undefined> to just Observable<T>.
 *
 * @param source observable to operate on
 */
export const skipUndefined = <T>(source: Observable<T | undefined>) => {
  return source.pipe(filter(notUndefined));
};
