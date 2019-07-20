import { entries } from "../functions";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { NonNull } from "../utils/types";

export function propertiesNotNull<T>(obj: T): obj is { [P in keyof T]: NonNull<T[P]> } {
  const hasNull = entries(obj)
      .some(x => x[1] === null);

  return !hasNull;
}

export function skipSomePropertyNull<T>(source: Observable<T>) {
  return source.pipe(filter(propertiesNotNull));
}
