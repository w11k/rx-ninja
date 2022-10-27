import { NonNull } from "../utils/types";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

/**
 * Returns a type guard function, which receives an object and checks if the given property is not null.
 * Narrows the type of the given property within the object type from T | null to just T.
 *
 * Example:
 *
 * incoming type is { a: number, b: string | null }
 *
 * outgoing type of returned type guard from propertyNotNull('b') is { a: number, b: string }
 *
 * @param property name of the property to check
 */
export function isPropertyNotNull<T, P extends keyof T>(property: P) {
  return (obj: T): obj is { [X in keyof T]: X extends P ? NonNull<T[X]> : T[X] } => {
    const value = obj[property];

    return value !== null;
  };
}

/**
 * Skips / filters values which contains null for the given property.
 * Narrows the type of the given property within the object type from T | null to just T.
 *
 * Example:
 *
 * <img src="media://skip-property-null.svg" alt="marble">
 *
 * ```ts
 * const x: Observable<{ a: number, b: string | null }>;
 *
 * const z: Observable<{ a: number, b: string }> = x.pipe(
 *   skipPropertyNull('b')
 * );
 * ```
 *
 * value { a: 1, b: 'foo' } will pass through
 *
 * value { a: 1, b: null } will be skipped
 *
 * @param prop name of the property to check
 */
export function skipPropertyNull<T, P extends keyof T>(prop: P) {
  return function operateFunction(source: Observable<T>) {
    return source.pipe(filter(isPropertyNotNull(prop)));
  };
}
