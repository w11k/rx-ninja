import { Observable } from "rxjs";
import { filter, flatMap, materialize } from "rxjs/operators";

export function skipUntilCompletionAndContinueWith<T, O>(continueWith: () => Observable<O>): (input: Observable<T>) => Observable<O> {
  return (input: Observable<T>) => {
    return input.pipe(
        materialize(),
        filter((value: any) => value.kind === "C"),
        flatMap(() => continueWith()),
    );
  };
}
