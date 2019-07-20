import { NonNull } from "../utils/types";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

export function propertyNotNull<T, P extends keyof T>(property: P) {
  return (obj: T): obj is { [X in keyof T]: X extends P ? NonNull<T[X]> : T[X] } => {
    const value = obj[property];

    return value !== null;
  };
}

export function skipPropertyNull<T, P extends keyof T>(prop: P) {
  return function (source: Observable<T>) {
    return source.pipe(filter(propertyNotNull(prop)));
  };
}
