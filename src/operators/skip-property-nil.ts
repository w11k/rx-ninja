import { NonNil } from "../utils/types";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

/**
 * Returns a type guard function, which receives an object and checks if the given property is neither null nor
 * undefined. Narrows the type of the given property within the object type from T | null | undefined to just T.
 *
 * Example:
 *
 * incoming type is { a: number, b: string | null | undefined }
 *
 * outgoing type of returned type guard from propertyNotNil('b') is { a: number, b: string }
 *
 * @param property name of the property to check
 */
export function propertyNotNil<T, P extends keyof T>(property: P) {
  return (obj: T): obj is { [X in keyof T]: X extends P ? NonNil<T[X]> : T[X] } => {
    const value = obj[property];

    return value !== null && value !== undefined;
  };
}

/**
 * Skips / filters values which contains null or undefined for the given property.
 * Narrows the type of the given property within the object type from T | null | undefined to just T.
 *
 * Example:
 *
 * ```ts
 * const x: Observable<{ a: number, b: string | null | undefined }>;
 *
 * const z: Observable<{ a: number, b: string }> = x.pipe(
 *   skipPropertyNil('b')
 * );
 * ```
 *
 * value { a: 1, b: 'foo' } will pass through
 *
 * value { a: 1, b: null } will be skipped
 *
 * value { a: 1, b: undefined } will be skipped
 *
 * @param prop name of the property to check
 */
export function skipPropertyNil<T, P extends keyof T>(prop: P) {
  return function operateFunction(source: Observable<T>) {
    return source.pipe(filter(propertyNotNil(prop)));
  };
}
