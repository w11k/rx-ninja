import { NonUndefined } from "../utils/types";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { entries } from "../functions";

export function propertiesNotUndefined<T>(obj: T): obj is { [P in keyof T]: NonUndefined<T[P]> } {
  const hasUndefined = entries(obj)
      .some(x => x[1] === undefined);

  return !hasUndefined;
}

export function skipSomePropertyUndefined<T>(source: Observable<T>) {
  return source.pipe(filter(propertiesNotUndefined));
}
