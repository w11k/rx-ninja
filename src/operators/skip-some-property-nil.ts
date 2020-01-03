import { NonNil } from "../utils/types";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { entries } from "../utils/functions";

/**
 * Type guard function, checking if any property of the given object is neither undefined nor null.
 * Narrows the type of all properties within the object type from T | null | undefined to T.
 *
 * Example:
 * incoming type is { a: number | null, b: string | undefined }
 *
 * outgoing type is { a: number, b: string }
 *
 * @param obj object to check
 */
export function hasNoNilProperties<T>(obj: T): obj is { [P in keyof T]: NonNil<T[P]> } {
  const hasNil = entries(obj)
      .some(x => x[1] === null || x[1] === undefined);

  return !hasNil;
}

/**
 * @see hasNoNilProperties
 * @deprecated
 */
export const propertiesNotNil = hasNoNilProperties;

/**
 * Skips / filters values which contains null or undefined for any property.
 * Narrows the type of all properties within the object type from T | null | undefined to just T.
 *
 * Example:
 *
 * ```ts
 * const x: Observable<{ a: number | null, b: string | undefined }>;
 *
 * const z: Observable<{ a: number, b: string }> = x.pipe(
 *   skipSomePropertyNil
 * );
 * ```
 *
 * value { a: 1, b: 'foo' } will pass through
 *
 * value { a: 1, b: undefined } will be skipped
 *
 * value { a: null, b: 'foo' } will be skipped
 */
export function skipSomePropertyNil<T>() {
  return function operatorFunction(source: Observable<T>) {
    return source.pipe(filter(hasNoNilProperties));
  };
}
