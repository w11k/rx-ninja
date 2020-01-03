import { NonNil } from "../utils/types";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

/**
 * Returns a type guard function, which receives an object and checks if the given property is not undefined.
 * Narrows the type of the given property within the object type from T | undefined to just T.
 *
 * Example:
 *
 * incoming type is { a: number, b: string | undefined }
 *
 * outgoing type of returned type guard from propertyNotUndefined('b') is { a: number, b: string }
 *
 * @param property name of the property to check
 */
export function isPropertyNotUndefined<T, P extends keyof T>(property: P) {
  return (obj: T): obj is { [X in keyof T]: X extends P ? NonNil<T[X]> : T[X] } => {
    const value = obj[property];

    return value !== undefined;
  };
}

/**
 * Skips / filters values which contains undefined for the given property.
 * Narrows the type of the given property within the object type from T | undefined to just T.
 *
 * Example:
 *
 * ```ts
 * const x: Observable<{ a: number, b: string | undefined }>;
 *
 * const z: Observable<{ a: number, b: string }> = x.pipe(
 *   skipPropertyUndefined('b')
 * );
 * ```
 *
 * value { a: 1, b: 'foo' } will pass through
 *
 * value { a: 1, b: undefined } will be skipped
 *
 * @param prop name of the property to check
 */
export function skipPropertyUndefined<T, P extends keyof T>(prop: P) {
  return function operateFunction(source: Observable<T>) {
    return source.pipe(filter(isPropertyNotUndefined(prop)));
  };
}
