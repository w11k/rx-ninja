import { AsyncPrioritizedQueue } from "./async-prioritized-queue";
import { Subject } from "rxjs";
import { take } from "rxjs/operators";
import { spy } from "sinon";
import { expect } from "chai";

describe("AsyncPrioritizedQueue", () => {
  let queue: AsyncPrioritizedQueue;

  beforeEach(async () => {
    queue = new AsyncPrioritizedQueue();
  });

  it("should map forward", async () => {

    const test = spy(x => x);

    const test1 = createMockWorker(1);
    const test2 = createMockWorker(2);
    const test3 = createMockWorker(3);

    const worker1Finished = queue.add(test1.worker, 1).toPromise().then(test);

    // expect that test1 was called immediately after queuing
    expect(test1.worker.callCount).eq(1);

    const worker2Finished = queue.add(test2.worker, 2).toPromise().then(test);
    const worker3Finished = queue.add(test3.worker, 1).toPromise().then(test);

    test1.trigger.next();
    await worker1Finished;

    // only result of test1 should arrive at test till now
    expect(test.callCount).eq(1);
    expect(test.returnValues[0]).eq(1);

    // expect that test3 with higher priority than test2 get started after test1
    expect(test3.worker.callCount).eq(1);
    // expect that test2 with started after test3
    expect(test2.worker.callCount).eq(0);


    test3.trigger.next();
    await worker3Finished;

    expect(test.callCount).eq(2);
    expect(test.returnValues[1]).eq(3);

    expect(test1.worker.callCount).eq(1);
    expect(test3.worker.callCount).eq(1);
    expect(test2.worker.callCount).eq(1);

    test2.trigger.next();
    await worker2Finished;

    expect(test.callCount).eq(3);
    expect(test.returnValues[2]).eq(2);
  });

});

function createMockWorker(result: number) {
  const trigger = new Subject<void>();

  const workerMock = spy(async () => {
    await trigger.pipe(take(1)).toPromise();
    return result;
  });

  return {
    trigger,
    worker: workerMock,
  };
}
