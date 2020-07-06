import {Observable} from "rxjs";
import {map, pairwise, startWith} from "rxjs/operators";

/**
 * Maps source to source and a partial source with changed properties.
 *
 * <img src="media://map-to-value-and-changed-properties.svg" alt="marble">
 *
 * Example:
 *
 * ```
 * source: a-b-c|
 * output: d-e-f|
 * ```
 *
 * with
 *
 * a = { a: 1 }
 * b = { a: 2, b: 3 }
 * c = { a: 2, b: 4 }
 * d = [{ a: 1 }, { a: 1 }]
 * e = [{ a: 2, b: 3 }, { a: 2, b: 3 }]
 * f = [{ a: 2, b: 4 }, { b: 4 }]
 *
 */
export function mapToValueAndChangedProperties<T>(): (source: Observable<T>) => Observable<[T, Partial<T>]> {
  return function operateFunction(source) {
    return source.pipe(
        startWith({}),
        pairwise(),
        map(([v1, v2]: [any, any]) => {
          const changed: any = {};
          for (let p in v2) {
            if (v2.hasOwnProperty(p) && v1[p] !== v2[p]) {
              changed[p] = v2[p];
            }
          }
          return [v2, changed] as any;
        }),
    );
  };
}
