import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

export function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

export const skipUndefined = <T>(source: Observable<T | undefined>) => {
  return source.pipe(filter(notUndefined));
};
