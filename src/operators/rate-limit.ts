import {asyncScheduler, BehaviorSubject, OperatorFunction, SchedulerLike, timer} from 'rxjs';
import {filter, map, mergeMap, take} from 'rxjs/operators';

/**
 * Limits the amount (count) of events passing the observable in the given time (slidingWindowTime).
 * Events exceeding the limit will be delayed until capacity is available again.
 *
 * It uses token bucket algorithm. There are specified amount of tokens.
 * Once a value is emitted, it consumes a token. Tokens are regenerated after a the given time.
 * It allows for short bursts of values to go through.
 * When there are no tokens left, the value have to wait for a token to regenerate in order to be emitted.
 */
export function rateLimitLossless<T>(count: number, slidingWindowTime: number, scheduler: SchedulerLike = asyncScheduler): OperatorFunction<T, T> {
  return rateLimit(count, slidingWindowTime, true, scheduler);
}

/**
 * Limits the amount (count) of events passing the observable in the given time (slidingWindowTime).
 * Events exceeding the limit will be skipped until capacity is available again.
 *
 * Use case :
 * * buffer an observable of messages that should be send to the server
 * * use a combined buffer closing notifier: interval and explicit (subject)
 * * limit the amount of buffer closings to not send to much requests to the server
 *
 * It uses token bucket algorithm. There are specified amount of tokens.
 * Once a value is emitted, it consumes a token. Tokens are regenerated after a the given time.
 * It allows for short bursts of values to go through.
 * When there are no tokens left, the value will be skipped.
 * New values will pass the limiter as soon as there are tokens available again.
 */
export function rateLimitLossy<T>(count: number, slidingWindowTime: number, scheduler: SchedulerLike = asyncScheduler): OperatorFunction<T, T> {
  return rateLimit(count, slidingWindowTime, false, scheduler);
}

function rateLimit<T>(count: number, slidingWindowTime: number, lossless: boolean, scheduler: SchedulerLike): OperatorFunction<T, T> {
  return function(source) {
    let tokens = count;
    const tokenChanged = new BehaviorSubject(tokens);
    const consumeToken = () => tokenChanged.next(--tokens);
    const renewToken = () => tokenChanged.next(++tokens);
    const availableTokens = tokenChanged.pipe(filter(() => tokens > 0));

    return source.pipe(
      filter(() => lossless || tokens > 0),
      mergeMap(value => {
        return availableTokens.pipe(
          take(1),
          map(() => {
            consumeToken();
            timer(slidingWindowTime, scheduler).subscribe(renewToken);
            return value;
          }),
        );
      })
    );
  };
}
