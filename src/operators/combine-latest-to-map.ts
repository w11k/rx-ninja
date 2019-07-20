import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";

export function combineLatestToMap<T>(obsMap: { [P in keyof T]: Observable<T[P]> }): Observable<T> {
  const keys = Object.keys(obsMap);

  // ensure same order for values and keys
  const values$ = keys.map(key => (obsMap as any)[key]);

  return combineLatest(values$).pipe(map(values => {
    // try to get rid of any
    // const mapOfValues: {[P in keyof T]: T[P]} = {};
    const mapOfValues: any = {};

    keys.forEach((key, index) => {
      mapOfValues[key] = values[index];
    });

    return mapOfValues;
  }));
}
