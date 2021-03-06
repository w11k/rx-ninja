import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

/**
 * Type guard checking a value is neither null nor undefined.
 * Narrows the type from T | null | undefined to just T.
 *
 * @param x value to check
 */
export function isNotNil<T>(x: T | null | undefined): x is T {
  return x !== null && x !== undefined;
}

/**
 * Type guard checking a value is null or undefined.
 * Narrows the type from T | null | undefined to null | undefined.
 *
 * @param x value to check
 */
export function isNil<T>(x: T | null | undefined): x is null | undefined {
  return x === null || x === undefined;
}

/**
 * Filters null and undefined values.
 * Narrows the type from Observable<T | null | undefined> to just Observable<T>.
 *
 * <img src="media://skip-nil.svg" alt="marble">
 */
export function skipNil() {
  return function operatorFunction<T>(source: Observable<T | null | undefined>) {
    return source.pipe(filter(isNotNil));
  };
}
