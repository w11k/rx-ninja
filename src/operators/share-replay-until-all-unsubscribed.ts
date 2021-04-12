import {Observable, OperatorFunction, Subject, Subscription} from "rxjs";

/**
 * Similar to shareReplay(1) but unsubscribes from the source observable as soon as there are no subscribers.
 *
 * Will resubscribe to the source as soon as a new subscriber subscribes.
 *
 * Replays values as long as there are other subscribers. But does not replay potentially outdated values
 * (subscriber count going from 0 to 1).
 *
 * Always replays error and complete signals.
 *
 * Use cases: building a time based cache that should be updated as long as there is somebody interested in updates.
 */
export function shareReplayUntilAllUnsubscribed<T>(): OperatorFunction<T, T> {
  const subject = new Subject<T>();
  let pullSubscription: Subscription | undefined;
  let latestValue: T | undefined;
  let replayLatestValue = false;
  let latestError: any;
  let replayLatestError = false;
  let refCount = 0;

  return (source) => {
    const target = new Observable<T>(subscriber => {
      refCount++;

      const pushDownSubscription = subject.subscribe(subscriber);

      if (pullSubscription === undefined) {
        pullSubscription = source.subscribe(
          x => {
            latestValue = x;
            replayLatestValue = true;
            replayLatestError = false;
            subject.next(x);
          },
          e => {
            subject.error(e);
            latestError = e;
            replayLatestError = true;
            replayLatestValue = false;
          },
          () => {
            subject.complete();
          },
        );
      }

      if (replayLatestValue) {
        subscriber.next(latestValue);
      }
      if (replayLatestError) {
        subscriber.error(latestError);
      }

      return () => {
        refCount--;

        if (refCount < 1) {
          pullSubscription?.unsubscribe();
          pullSubscription = undefined;
          replayLatestValue = false;
          replayLatestError = false;
        }

        pushDownSubscription?.unsubscribe();
      };
    });

    return target;
  };
}
