import { Observable, ReplaySubject } from "rxjs";

export type Worker<T> = () => Promise<T>;

/**
 * An asynchronous, prioritized, observable and removable queue of worker functions.
 *
 * Async - Workers are async functions. Next worker will be started when promise returned by previous worker resolves or rejects.
 *
 * Prioritized - Each worker has a priority. 0 is highest, higher numbers means lower priority.
 * Worker with higher priority will be executed first.
 *
 * Observable - Calling the add method returns an observable. The worker will be queued on subscribing this observable.
 * Multiple subscriptions lead to multiple executions of the worker.
 * This observable will emit the result of the finished worker and then will complete immediately.
 * It will send an error if the worker throws an error or rejects the returned promise.
 *
 * Removable - The worker will be removed from the queue if the subscriber unsubscribes early, before the worker is started.
 * If the subscriber unsubscribes late (the worker was already called but hasn't finished yet), it will not be cancelled.
 * The caller will just miss the result.
 *
 * Unhandled Errors - An error thrown by a worker will be passed through to the observable subscriber.
 * If the subscriber unsubscribes during the execution of the worker, and the worker throws an error the error will be passed the the
 * unhandledErrors observable (together with the worker function as a hint who throws that error).
 *
 */
export class AsyncPrioritizedQueue {
  private readonly priorities = new Set<number>();
  private readonly workers = new Map<number, Worker<any>[]>();
  private isRunning: boolean = false;

  private readonly unhandledErrors$ = new ReplaySubject<{ error: any, worker: Worker<any> }>(1);

  get unhandledErrors(): Observable<{ error: any, worker: Worker<any> }> {
    return this.unhandledErrors$;
  }

  /**
   * Creates an Observable for queuing the given worker with the given priority.
   * Subscribe to add the worker to the queue. Multiple subscriptions will add the worker multiple times.
   * Unsubscribe before completion to remove the worker from the queue.
   *
   * Observable emits the result of the worker and then completes immediately.
   * Observable mirrors any error thrown by the worker.
   *
   * @param worker
   * @param priority
   */
  add<T>(worker: Worker<T>, priority: number): Observable<T> {
    if (priority < 0) {
      throw new Error("priority should not be smaller than 0");
    }

    return new Observable<T>(subscriber => {
      this.priorities.add(priority);

      if (!this.workers.has(priority)) {
        this.workers.set(priority, []);
      }

      const workers = this.workers.get(priority);

      if (workers === undefined) {
        throw new Error("bug in implementation of this method, workers should not be undefined");
      }

      let unsubscribed = false;

      const workerWrapper = async () => {
        try {
          if (!unsubscribed) {
            const result = await worker();
            subscriber.next(result);
          }
          subscriber.complete();
        } catch (e) {
          if (unsubscribed) {
            this.unhandledErrors$.next({
              error: e,
              worker: worker
            });
          } else {
            subscriber.error(e);
          }
        }

        this.start();
      };

      workers.push(workerWrapper);
      this.start();

      return () => {
        unsubscribed = true;
      };
    });
  }

  private async start(): Promise<void> {
    if (!this.isRunning) {
      const worker = this.getNextWorker();

      if (worker === undefined) {
        return;
      }

      this.isRunning = true;
      await worker();
      this.isRunning = false;

      this.start();
    }
  }

  private getNextWorker(): Worker<any> | undefined {
    const priorities = Array.from(this.priorities.values()).sort();

    if (priorities.length === 0) {
      return undefined;
    }

    const nextPriority = priorities[0];

    const workers = this.workers.get(nextPriority);

    if (workers === undefined || workers.length === 0) {
      return undefined;
    }

    const worker = workers.shift();

    if (workers.length === 0) {
      this.priorities.delete(nextPriority);
      this.workers.delete(nextPriority);
    }

    return worker;
  }
}
