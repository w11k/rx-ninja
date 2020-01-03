import { NonUndefined } from "../utils/types";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { entries } from "../utils/functions";

/**
 * Type guard function, checking if any property of the given object is not undefined.
 * Narrows the type of all properties within the object type from T | undefined to just T.
 *
 * Example:
 *
 * incoming type is { a: number | undefined, b: string | undefined }
 *
 * outgoing type is { a: number, b: string }
 *
 * @param obj object to check
 */
export function hasNoUndefinedProperties<T>(obj: T): obj is { [P in keyof T]: NonUndefined<T[P]> } {
  const hasUndefined = entries(obj)
      .some(x => x[1] === undefined);

  return !hasUndefined;
}

/**
 * Skips / filters values which contains undefined for any property.
 * Narrows the type of all properties within the object type from T | undefined to just T.
 *
 * Example:
 *
 * ```ts
 * const x: Observable<{ a: number | undefined, b: string | undefined }>;
 *
 * const z: Observable<{ a: number, b: string }> = x.pipe(
 *   skipSomePropertyUndefined
 * );
 * ```
 *
 * value { a: 1, b: 'foo' } will pass through
 *
 * value { a: 1, b: undefined } will be skipped
 *
 * value { a: undefined, b: 'foo' } will be skipped
 */
export function skipSomePropertyUndefined<T>() {
  return function operatorFunction(source: Observable<T>) {
    return source.pipe(filter(hasNoUndefinedProperties));
  };
}

