import { Observable } from "rxjs";

/**
 * Calls the given provider function when a new subscriber subscribes and delivers the result of this call as first value.
 *
 * @param provider function that should be called
 */
export function startWith<T>(provider: () => T): (source: Observable<T>) => Observable<T> {
  return (source) => {
    return new Observable<T>(subscriber => {
      try {
        subscriber.next(provider());
      } catch (e) {
        subscriber.error(e);
      }
      const subscription = source.subscribe(subscriber);

      return () => {
        subscription.unsubscribe();
      };
    });
  };
}
