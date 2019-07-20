import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { Newable } from "../utils/types";

export function instanceOf<A>(clazz: Newable<A>) {
  return function<B>(x: A | B): x is A {
    return x instanceof clazz;
  };
}

export function justInstanceOf<A>(clazz: Newable<A>) {
  return function<B>(source: Observable<A | B>) {
    return source.pipe(filter(instanceOf(clazz)));
  };
}
