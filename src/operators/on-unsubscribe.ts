import { Observable } from "rxjs";

/**
 * Calls the given teardown function when the subscriber unsubscribes.
 * Completion and an error send by the observable will lead to unsubscribing and therefore also trigger a call of the
 * given teardown function.
 *
 * @param teardown function that should be called
 */
export function onUnsubscribe<T>(teardown: () => void): (source: Observable<T>) => Observable<T> {
  return (source) => {
    return new Observable<T>(subscriber => {
      const subscription = source.subscribe(subscriber);

      return () => {
        teardown();
        subscription.unsubscribe();
      };
    });
  };
}
