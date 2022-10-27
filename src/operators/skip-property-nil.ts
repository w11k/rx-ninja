import { NonNil } from "../utils/types";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Internal helper types
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

type PropertyNotNil<O extends object, P extends keyof O> = {
  [X in keyof O]: X extends P ? NonNil<O[X]> : O[X]
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Plain function overloads
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Predicate / type guard function, checks if the given property is neither null nor undefined.
 * Narrows the type of the given property within the object type from ```T | null | undefined``` to just ```T```.
 *
 * Two variants:
 *
 * A simple function for direct calls (e.g. in if-statement-conditions).
 * It asks for the object to check as well as the property.
 *
 * The second variant is a factory-function which only gets the property.
 * It returns a pre-configured predicate function for usage with functional calls like Array#filter.
 *
 * Example:
 * ```ts
 * const x: { a: number, b: string | undefined } = { a: 1, b: 'example' };
 *
 * // simple usage: pass object and property path
 * if (isPropertyNotNil(x, 'b')) {
 *   // type of x is now { a: number, b: string }
 *   x.b.charAt(3); // safe to access b
 * }
 *
 * // array usage: just pass the property to check
 * [x]
 *   .filter(isPropertyNotNil('b'))
 *   // type is now [{ a: number, b: string }]
 *   .map(x => x.b.charAt(3)) // safe to access b
 * ```
 */
export function isPropertyNotNil<O extends object, P extends keyof O>(obj: O, property?: P): obj is PropertyNotNil<O, P>;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Array operators overloads
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export function isPropertyNotNil<O extends object, P extends keyof O>(prop: P): (obj: O) => obj is PropertyNotNil<O, P>;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Plain and array implementation
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export function isPropertyNotNil<O extends object, P extends keyof O>(objOrProp: O | P, prop?: P) {
  if (typeof objOrProp === "object" && prop !== undefined) {
    return check(objOrProp, prop);
  }
  else if (typeof objOrProp === "string") {
    return (obj: O) => check(obj, objOrProp);
  }

  throw new Error("bug in implementation of overloaded function");
}

function check<T extends object, P extends keyof T>(obj: T, property: P): obj is PropertyNotNil<T, P> {
  if (obj === null || obj === undefined) {
    return false;
  }

  const value = obj[property];

  return value !== null && value !== undefined;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Observable operator overloads
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Skips values which contains null or undefined for the given property.
 * Narrows the type of the given property within the object type from T | null | undefined to T.
 *
 * <img src="media://skip-property-nil.svg" alt="marble">
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
export function skipPropertyNil<T extends object, P extends keyof T>(prop: P) {
  return function operateFunction(source: Observable<T>) {
    return source.pipe(filter(isPropertyNotNil(prop)));
  };
}
