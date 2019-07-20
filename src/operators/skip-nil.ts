import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

export function notNil<T>(x: T | null | undefined): x is T {
  return x !== null && x !== undefined;
}

export const skipNil = <T>(source: Observable<T | null | undefined>) => {
  return source.pipe(filter(notNil));
};
