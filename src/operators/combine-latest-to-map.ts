import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";

/**
 * Combines latest values from given source observables, like the original combineLatest does.
 * Unlike combineLatest this variant expects a object (map) instead of an array and delivers a object instead of an array.
 *
 * A map instead of an array helps to avoid issues with reading wrong array index.
 * If you have an array with one number-observable and one string-observable, typescript is able to tell you which
 * array element is the number and which the string.
 * But imagine an array of two string-observable. Typescript just can tell you that both are strings. It is your
 * challenge to not mix up the order. A map with key instead of index based access helps to avoid this mix up.
 *
 * <img src="media://combine-latest-to-map.svg" alt="marble">
 *
 * Example:
 * source: { A: Observable<string>, B: Observable<string> }
 *
 * result: Observable<{ A: string, B: string}>
 *
 * ```
 * sourceA: -a---b---c--|
 * sourceB: ---d---e---f---|
 * result:  ---g-h-i-j-k---|
 * ```
 *
 * with
 *
 * g = { A: 'a', B: 'd' }
 *
 * h = { A: 'b', B: 'd' }
 *
 * i = { A: 'b', B: 'e' }
 *
 * j = { A: 'c', B: 'e' }
 *
 * k = { A: 'c', B: 'f' }
 *
 * @param obsMap source observables
 */
export function combineLatestToMap<T>(obsMap: { [P in keyof T]: Observable<T[P]> }): Observable<T> {
  const keys = Object.keys(obsMap);

  // ensure same order for values and keys
  const values$ = keys.map(key => (obsMap as any)[key]);

  return combineLatest(values$).pipe(map(values => {
    const mapOfValues: any = {};

    keys.forEach((key, index) => {
      mapOfValues[key] = values[index];
    });

    return mapOfValues;
  }));
}
