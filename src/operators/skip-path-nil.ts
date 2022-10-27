import { NonNil } from "..";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Internal helper types
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

type PathNotNil_1<O,
    P1 extends keyof O> = {
  [V1 in P1]-?: NonNil<O[P1]>
};

type PathNotNil_2<O,
    P1 extends keyof O,
    P2 extends keyof NonNil<O[P1]>> = {
  [V1 in P1]-?: PathNotNil_1<NonNil<O[P1]>, P2>
};

type PathNotNil_3<O,
    P1 extends keyof O,
    P2 extends keyof NonNil<O[P1]>,
    P3 extends keyof NonNil<NonNil<O[P1]>[P2]>> = {
  [V1 in P1]-?: PathNotNil_2<NonNil<O[P1]>, P2, P3>
};

type PathNotNil_4<O,
    P1 extends keyof O,
    P2 extends keyof NonNil<O[P1]>,
    P3 extends keyof NonNil<NonNil<O[P1]>[P2]>,
    P4 extends keyof NonNil<NonNil<NonNil<O[P1]>[P2]>[P3]>> = {
  [V1 in P1]-?: PathNotNil_3<NonNil<O[P1]>, P2, P3, P4>
};

type PathNotNil_5<O,
    P1 extends keyof O,
    P2 extends keyof NonNil<O[P1]>,
    P3 extends keyof NonNil<NonNil<O[P1]>[P2]>,
    P4 extends keyof NonNil<NonNil<NonNil<O[P1]>[P2]>[P3]>,
    P5 extends keyof NonNil<NonNil<NonNil<NonNil<O[P1]>[P2]>[P3]>[P4]>> = {
  [V1 in P1]-?: PathNotNil_4<NonNil<O[P1]>, P2, P3, P4, P5>
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Plain function overloads
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Checks whether the given property path contains ```null``` or ```undefined``` within the given object.
 * Narrows the type of each property in the path from ```T | null | undefined``` to ```T```.
 *
 * There are two variants:
 *
 * A simple function for direct calls (e.g. in if-statement-conditions).
 * It asks for the object to check as well as the property path.
 *
 * The second variant is a factory-function which only gets the property path.
 * It returns a pre-configured predicate function for usage with functional calls like Array#filter.
 *
 * Both variants have overloads with up to 5 properties to check.
 *
 * Example:
 *
 * ```ts
 * const x: { a: { b: number | undefined } } = { a: { b: 1 } };
 *
 * // simple usage: pass object and property path
 * if (isPathNotNil(x, 'a', 'b')) {
 *   // type of x is now { a: { b: number } }
 *   x.a.b.toFixed(3); // safe to access a and b
 * }
 *
 * // array usage: just pass the properties to check
 * [x]
 *   .filter(isPathNotNil('a', 'b'))
 *   // type is now [{ a: { b: number } }]
 *   .map(x => x.a.b.toFixed(3)) // safe to access a and b
 * ```
 *
 * With a path of just one property it does the same as isPropertyNotNil.
 */
export function isPathNotNil<O extends object,
    P1 extends keyof O>(
    obj: O, p1: P1
): obj is PathNotNil_1<O, P1> & O;

export function isPathNotNil<O extends object,
    P1 extends keyof O,
    P2 extends keyof NonNil<O[P1]>>(
    obj: O, p1: P1, p2: P2,
): obj is PathNotNil_2<O, P1, P2> & O;

export function isPathNotNil<O extends object,
    P1 extends keyof O,
    P2 extends keyof NonNil<O[P1]>,
    P3 extends keyof NonNil<NonNil<O[P1]>[P2]>>(
    obj: O, p1: P1, p2: P2, p3: P3
): obj is PathNotNil_3<O, P1, P2, P3> & O;

export function isPathNotNil<O extends object,
    P1 extends keyof O,
    P2 extends keyof NonNil<O[P1]>,
    P3 extends keyof NonNil<NonNil<O[P1]>[P2]>,
    P4 extends keyof NonNil<NonNil<NonNil<O[P1]>[P2]>[P3]>>(
    obj: O, p1: P1, p2: P2, p3: P3, p4: P4
): obj is PathNotNil_4<O, P1, P2, P3, P4> & O;

export function isPathNotNil<O extends object,
    P1 extends keyof O,
    P2 extends keyof NonNil<O[P1]>,
    P3 extends keyof NonNil<NonNil<O[P1]>[P2]>,
    P4 extends keyof NonNil<NonNil<NonNil<O[P1]>[P2]>[P3]>,
    P5 extends keyof NonNil<NonNil<NonNil<NonNil<O[P1]>[P2]>[P3]>[P4]>>(
    obj: O, p1: P1, p2: P2, p3: P3, p4: P4, p5: P5
): obj is PathNotNil_5<O, P1, P2, P3, P4, P5> & O;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Array operators overloads
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export function isPathNotNil<O extends object,
    P1 extends keyof O>(
    p1: P1
): (obj: O) => obj is PathNotNil_1<O, P1> & O;

export function isPathNotNil<O extends object,
    P1 extends keyof O,
    P2 extends keyof NonNil<O[P1]>>(
    p1: P1, p2: P2,
): (obj: O) => obj is PathNotNil_2<O, P1, P2> & O;

export function isPathNotNil<O extends object,
    P1 extends keyof O,
    P2 extends keyof NonNil<O[P1]>,
    P3 extends keyof NonNil<NonNil<O[P1]>[P2]>>(
    p1: P1, p2: P2, p3: P3
): (obj: O) => obj is PathNotNil_3<O, P1, P2, P3> & O;

export function isPathNotNil<O extends object,
    P1 extends keyof O,
    P2 extends keyof NonNil<O[P1]>,
    P3 extends keyof NonNil<NonNil<O[P1]>[P2]>,
    P4 extends keyof NonNil<NonNil<NonNil<O[P1]>[P2]>[P3]>>(
    p1: P1, p2: P2, p3: P3, p4: P4
): (obj: O) => obj is PathNotNil_4<O, P1, P2, P3, P4> & O;

export function isPathNotNil<O extends object,
    P1 extends keyof O,
    P2 extends keyof NonNil<O[P1]>,
    P3 extends keyof NonNil<NonNil<O[P1]>[P2]>,
    P4 extends keyof NonNil<NonNil<NonNil<O[P1]>[P2]>[P3]>,
    P5 extends keyof NonNil<NonNil<NonNil<NonNil<O[P1]>[P2]>[P3]>[P4]>>(
    p1: P1, p2: P2, p3: P3, p4: P4, p5: P5
): (obj: O) => obj is PathNotNil_5<O, P1, P2, P3, P4, P5> & O;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Plain and array implementation
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export function isPathNotNil<O extends object>(objOrProp: O | string, ...path: string[]) {
  if (typeof objOrProp === "string") {
    const combinedPath = [objOrProp, ...path];
    return function (obj: O) {
      return checkPath(obj, combinedPath);
    };
  }
  else {
    return checkPath(objOrProp, path);
  }
}

function checkPath<O>(obj: O, path: string[]) {
  let target: any = obj;
  for (const property of path) {
    const value = target[property];
    if (value === undefined || value === null) {
      return false;
    }
    target = value;
  }

  return true;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Observable operator overloads
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Skips values which contains ```null``` or ```undefined``` for the given property path.
 * Narrows the type of each property in the path from ```T | null | undefined``` to ```T```.
 *
 * Example:
 *
 * ```ts
 * const x: Observable<{ a: { b: number | null | undefined} }>;
 *
 * const z: Observable<{ a: { b: number } }> = x.pipe(
 *   skipPathNil('a', 'b')
 * );
 * ```
 *
 * value ```{ a: { b: 1 } }``` will pass through
 *
 * value ```{ a: null }``` will be skipped
 *
 * value ```{ a: { b: undefined } }``` will be skipped
 *
 * With a path of just one property it does the same as skipPropertyNil.
 *
 * Overloaded with up to 5 properties building the path to check.
 */
export function skipPathNil<O extends object,
    P1 extends keyof O>(
    p1: P1
): (obs: Observable<O>) => Observable<PathNotNil_1<O, P1>>;

export function skipPathNil<O extends object,
    P1 extends keyof O,
    P2 extends keyof NonNil<O[P1]>>(
    p1: P1, p2: P2
): (obs: Observable<O>) => Observable<PathNotNil_2<O, P1, P2>>;

export function skipPathNil<O extends object,
    P1 extends keyof O,
    P2 extends keyof NonNil<O[P1]>,
    P3 extends keyof NonNil<NonNil<O[P1]>[P2]>>(
    p1: P1, p2: P2, p3: P3
): (obs: Observable<O>) => Observable<PathNotNil_3<O, P1, P2, P3>>;

export function skipPathNil<O extends object,
    P1 extends keyof O,
    P2 extends keyof NonNil<O[P1]>,
    P3 extends keyof NonNil<NonNil<O[P1]>[P2]>,
    P4 extends keyof NonNil<NonNil<NonNil<O[P1]>[P2]>[P3]>>(
    p1: P1, p2: P2, p3: P3, p4: P4
): (obs: Observable<O>) => Observable<PathNotNil_4<O, P1, P2, P3, P4>>;

export function skipPathNil<O extends object,
    P1 extends keyof O,
    P2 extends keyof NonNil<O[P1]>,
    P3 extends keyof NonNil<NonNil<O[P1]>[P2]>,
    P4 extends keyof NonNil<NonNil<NonNil<O[P1]>[P2]>[P3]>,
    P5 extends keyof NonNil<NonNil<NonNil<NonNil<O[P1]>[P2]>[P3]>[P4]>>(
    p1: P1, p2: P2, p3: P3, p4: P4, p5: P5
): (obs: Observable<O>) => Observable<PathNotNil_5<O, P1, P2, P3, P4, P5>>;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Observable operator implementation
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export function skipPathNil<O extends object,
    P1 extends keyof O,
    P2 extends keyof NonNil<O[P1]>,
    P3 extends keyof NonNil<NonNil<O[P1]>[P2]>,
    P4 extends keyof NonNil<NonNil<NonNil<O[P1]>[P2]>[P3]>,
    P5 extends keyof NonNil<NonNil<NonNil<NonNil<O[P1]>[P2]>[P3]>[P4]>>(
    p1: P1, p2?: P2, p3?: P3, p4?: P4, p5?: P5,
) {
  return function operateFunction(source: Observable<O>) {
    if (p2 === undefined) {
      return source.pipe(filter(isPathNotNil(p1)));
    }
    else if (p3 === undefined) {
      return source.pipe(filter(isPathNotNil(p1, p2)));
    }
    else if (p4 === undefined) {
      return source.pipe(filter(isPathNotNil(p1, p2, p3)));
    }
    else if (p5 === undefined) {
      return source.pipe(filter(isPathNotNil(p1, p2, p3, p4)));
    }
    else {
      return source.pipe(filter(isPathNotNil(p1, p2, p3, p4, p5)));
    }
  };
}
