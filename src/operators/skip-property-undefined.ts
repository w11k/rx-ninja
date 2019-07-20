import { NonNil } from "../utils/types";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

export function propertyNotUndefined<T, P extends keyof T>(property: P) {
  return (obj: T): obj is { [X in keyof T]: X extends P ? NonNil<T[X]> : T[X] } => {
    const value = obj[property];

    return value !== undefined;
  };
}

export function skipPropertyUndefined<T, P extends keyof T>(prop: P) {
  return function (source: Observable<T>) {
    return source.pipe(filter(propertyNotUndefined(prop)));
  };
}
