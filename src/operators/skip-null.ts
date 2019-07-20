import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

export function notNull<T>(x: T | null): x is T {
  return x !== null;
}

export const skipNull = <T>(source: Observable<T | null>) => {
  return source.pipe(filter(notNull));
};
