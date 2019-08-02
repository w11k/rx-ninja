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
 * Example:
 * source: { a: Observable<string>, b: Observable<string> }
 *
 * result: Observable<{ a: string, b: string}>
 *
 * ```
 * sourceA: -a---b---c--|
 * sourceB: ---x---y---z---|
 * result:  -1-2-3-4-5-6---|
 * ```
 *
 * with
 *
 * 1 = { a: 'a', b: undefined }
 *
 * 2 = { a: 'a', b: 'x' }
 *
 * 3 = { a: 'b', b: 'x' }
 *
 * 4 = { a: 'b', b: 'y' }
 *
 * 5 = { a: 'c', b: 'y' }
 *
 * 6 = { a: 'c', b: 'z' }
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
