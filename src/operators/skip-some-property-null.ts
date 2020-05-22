import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { NonNull } from "../utils/types";
import { entries } from "../utils/functions";

/**
 * Type guard function, checking if any property of the given object is not null.
 * Narrows the type of all properties within the object type from T | null to just T.
 *
 * Example:
 *
 * incoming type is { a: number | null, b: string | null }
 *
 * outgoing type is { a: number, b: string }
 *
 * @param obj object to check
 */
export function hasNoNullProperties<T>(obj: T): obj is { [P in keyof T]: NonNull<T[P]> } {
  const hasNull = entries(obj)
      .some(x => x[1] === null);

  return !hasNull;
}

/**
 * Skips / filters values which contains null for any property.
 * Narrows the type of all properties within the object type from T | null to just T.
 *
 * <img src="media://skipSomePropertyNull.png" alt="marble">
 *
 * Example:
 *
 * ```ts
 * const x: Observable<{ a: number | null, b: string | null }>;
 *
 * const z: Observable<{ a: number, b: string }> = x.pipe(
 *   skipSomePropertyNull
 * );
 * ```
 *
 * value { a: 1, b: 'foo' } will pass through
 *
 * value { a: 1, b: null } will be skipped
 *
 * value { a: null, b: 'foo' } will be skipped
 */
export function skipSomePropertyNull<T>() {
  return function operatorFunction(source: Observable<T>) {
    return source.pipe(filter(hasNoNullProperties));
  };
}

