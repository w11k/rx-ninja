import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { Newable } from "../utils/types";

/**
 * Returns a type guard function that checks if the given value is an instance of clazz
 *
 * @param clazz the class to check
 */
export function instanceOf<A>(clazz: Newable<A>) {
  return function<B>(x: A | B): x is A {
    return x instanceof clazz;
  };
}

/**
 * Filters all values that are not instances of the given class
 *
 * @param clazz which instances are passed through
 */
export function justInstanceOf<A>(clazz: Newable<A>) {
  return function operateFunction<B>(source: Observable<A | B>) {
    return source.pipe(filter(instanceOf(clazz)));
  };
}
