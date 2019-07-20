import { NonNil } from "../utils/types";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { entries } from "../utils/functions";

export function propertiesNotNil<T>(obj: T): obj is { [P in keyof T]: NonNil<T[P]> } {


  const hasNil = entries(obj)
      .some(x => x[1] === null || x[1] === undefined);

  return !hasNil;
}

export function skipSomePropertyNil<T>(source: Observable<T>) {
  return source.pipe(filter(propertiesNotNil));
}
