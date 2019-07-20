import { Observable } from "rxjs";
import { flatMap, materialize } from "rxjs/operators";

export function onCompletionContinueWith<T, O>(continueWith: (lastValue: T) => Observable<O>) {
  let lastValue: T;
  return (input: Observable<T>) => {
    return input.pipe(
        materialize(),
        flatMap((value: any) => {
          if (value.kind === "N") {
            lastValue = value.value!;
            return value.toObservable();
          } else if (value.kind === "C") {
            return continueWith(lastValue);
          } else {
            return value.toObservable();
          }
        })
    );
  };
}
