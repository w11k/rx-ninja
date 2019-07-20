import { merge, Observable, Operator, Subject, Subscriber, TeardownLogic } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

export type ExecuteLatestOnIdleEvent<T, R = void> = StartedEvent<T> | SkippedEvent<T> | FinishedEvent<T, R> | ErrorEvent<T>;

export class StartedEvent<T> { constructor(public readonly input: T) {} }
export class SkippedEvent<T> { constructor(public readonly input: T) {} }
export class FinishedEvent<T, R> { constructor(public readonly input: T, public readonly output: R) {} }
export class ErrorEvent<T> { constructor(public readonly input: T, public readonly error: any) {} }

export type ExecuteLatestOnIdleOperatorFunction<T, R> = {(obs: Observable<T>): Observable<ExecuteLatestOnIdleEvent<T, R>>, readonly idle: Observable<boolean> }

/**
 * Calls the given execute function with the latest value from the source observable as soon as a running call of executeFun finished.
 *
 * ## Example:
 * - source emitted 1 -> emit StartedEvent 1 to subscriber, call executeFun with 1
 * - executeFun finished 1 -> emit FinishedEvent 1 to subscriber
 * - source emitted 2 -> emit StartedEvent 2 to subscriber, call executeFun with 2
 * - source emitted 3 -> cache 3 because executeFun didn't finished for 2 yet
 * - executeFun finished 2 -> emit FinishedEvent 2 to subscriber, emit StartedEvent 3 to subscriber, call executeFun with 3
 * - source emitted 4 -> cache 4 because executeFun didn't finished for 3 yet
 * - source emitted 5 -> emit SkippedEvent for 4 and cache 5 because executeFun didn't finished for 3 yet
 * - executeFun finished 3 -> emit FinishedEvent 3 to subscriber, emit StartedEvent 5 to subscriber, call executeFun with 5
 * - source completed -> executeFun didn't finished for 5 yet, delay completion
 * - executeFun finished 5 -> emit FinishedEvent 6 to subscriber, complete subscriber
 *
 * ## Error Handling:
 * - For errors caused by the execute function, an ErrorEvent will be emitted to the subscriber.
 * - Errors of the source observable will be passed through.
 *
 * @param executeFun Function to execute with latest value from source observable.
 *   Can return something synchronously or asynchronously. Returned value will be included in FinishedEvent.
 */
export function executeLatestOnIdle<T, R = void>(executeFun: (t: T) => Promise<R> | R): ExecuteLatestOnIdleOperatorFunction<T, R> {
  const operator = new ExecuteLatestOnIdleOperator(executeFun);

  function operatorFunction(obs: Observable<T>): Observable<ExecuteLatestOnIdleEvent<T, R>> {
    return obs.lift(operator);
  }

  Object.defineProperty(operatorFunction, 'idle', {
    get(): Observable<boolean> {
      return operator.idle;
    }
  });

  return operatorFunction as ExecuteLatestOnIdleOperatorFunction<T, R>;
}

class ExecuteLatestOnIdleOperator<T, R> implements Operator<T, ExecuteLatestOnIdleEvent<T, R>> {
  public idle = new BehaviorSubject<boolean>(true);

  constructor(private fun: (t: T) => Promise<R> | R) {}

  call(subscriber: Subscriber<ExecuteLatestOnIdleEvent<T, R>>, source: Observable<T>): TeardownLogic {

    const delayed$ = new Subject<T>();
    let hasLatestEvent = false;
    let latestEvent: T;
    let shouldComplete = false;

    const onMergedNext = async (x: T) => {
      if (this.idle.value) {
        this.idle.next(false);
        subscriber.next(new StartedEvent(x));

        try {
          const result =  await this.fun(x);
          subscriber.next(new FinishedEvent(x, result));
        } catch (e) {
          subscriber.next(new ErrorEvent(x, e));
        } finally {
          this.idle.next(true);
        }

        if (hasLatestEvent) {
          hasLatestEvent = false;
          delayed$.next(latestEvent);
        }
        else if (shouldComplete) {
          this.idle.complete();
          delayed$.complete();
        }
      }
      else {
        if (hasLatestEvent) {
          subscriber.next(new SkippedEvent(latestEvent));
        }
        latestEvent = x;
        hasLatestEvent = true;
      }
    };

    const onMergedError = (e: any) => {
      subscriber.error(e);
      this.idle.complete();
      delayed$.complete();
    };

    const onMergedComplete = () => {
      subscriber.complete();
      this.idle.complete();
    };

    const noop = () => {};

    const onSourceCompleted = () => {
      if (this.idle.value) {
        // complete synchronous
        delayed$.complete();
        this.idle.complete();
      }
      else {
        shouldComplete = true;
      }
    };

    const internalSubscription = merge(
        source.pipe(tap(noop, noop, onSourceCompleted)),
        delayed$
    ).subscribe(onMergedNext, onMergedError, onMergedComplete);

    const tearDown = () => {
      internalSubscription.unsubscribe();
      delayed$.complete();
      this.idle.complete();
    };

    return tearDown;
  }
}
