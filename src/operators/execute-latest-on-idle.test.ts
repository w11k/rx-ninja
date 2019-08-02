import {
  ErrorEvent,
  executeLatestOnIdle,
  ExecuteLatestOnIdleEvent,
  OperateFunction,
  FinishedEvent,
  SkippedEvent,
  StartedEvent,
} from "./execute-latest-on-idle";
import { Subject } from "rxjs";
import { filter, share, take } from "rxjs/operators";
import { expect } from "chai";
import { spy } from 'sinon';

describe("executeLatestOnIdle", () => {

  it("should call execute function once and fire two events", async () => {

    const test = setupWithTriggeredExecuteFun();

    const onNext = spy(async (x: ExecuteLatestOnIdleEvent<number>) => {
      console.log("ExecuteLatestOnIdleEvent", x);
    });
    test.processed.subscribe(onNext);

    test.source.next(0);
    test.executeFunFinishTrigger.next();

    expect(test.executeFun.callCount).eq(1);

    test.source.complete();

    await test.processed.toPromise();

    console.log(`checking call count of onNext`);

    expect(onNext.callCount).eq(2);
  });

  it("should not call execute function while running", async () => {

    const test = setupWithTriggeredExecuteFun();

    const onNext = spy((x: ExecuteLatestOnIdleEvent<number>) => {
      console.log("ExecuteLatestOnIdleEvent", x);
      return x;
    });
    test.processed.subscribe(onNext);

    test.source.next(0);

    expect(test.executeFun.callCount).eq(1);

    test.source.next(1);
    expect(test.executeFun.callCount).eq(1);

    test.source.next(2);
    expect(test.executeFun.callCount).eq(1);
    test.executeFunFinishTrigger.next();

    test.executeFunFinishTrigger.complete();
    test.source.complete();

    await test.processed.toPromise();

    expect(test.executeFun.callCount).eq(2);

    expect(onNext.callCount).eq(5);
    expect(onNext.returnValues[0]).instanceOf(StartedEvent);
    expect(onNext.returnValues[0].input).eq(0);
    expect(onNext.returnValues[1]).instanceOf(SkippedEvent);
    expect(onNext.returnValues[1].input).eq(1);
    expect(onNext.returnValues[2]).instanceOf(FinishedEvent);
    expect(onNext.returnValues[2].input).eq(0);
    expect(onNext.returnValues[3]).instanceOf(StartedEvent);
    expect(onNext.returnValues[3].input).eq(2);
    expect(onNext.returnValues[4]).instanceOf(FinishedEvent);
    expect(onNext.returnValues[4].input).eq(2);
  });

  it("should complete immediately before first event", async () => {

    const test = setupWithTriggeredExecuteFun();

    const onComplete = spy(() => {
    });

    test.processed.subscribe(expectNoCall, expectNoCall, onComplete);

    test.source.complete();

    await test.processed.toPromise();

    expect(test.executeFun.callCount).eq(0);
    expect(onComplete.callCount).eq(1);
  });

  it("should complete immediately on idle", async () => {

    const test = setupWithTriggeredExecuteFun();

    const onComplete = spy(noop);

    test.processed.subscribe(noop, expectNoCall, onComplete);

    test.source.next(0);
    expect(test.executeFun.callCount).eq(1);
    const idle = resolveOnIdle(test.operatorFun);
    test.executeFunFinishTrigger.next();

    await idle;

    expect(onComplete.callCount).eq(0);
    // should be sync when idle
    test.source.complete();
    expect(onComplete.callCount).eq(1);

    await test.processed.toPromise();
  });

  it("should complete asap after getting idle", async () => {

    const test = setupWithTriggeredExecuteFun();

    const onComplete = spy(noop);

    test.processed.subscribe(noop, expectNoCall, onComplete);

    test.source.next(0);
    expect(test.executeFun.callCount).eq(1);

    test.source.complete();
    // should be async while not idle
    expect(onComplete.callCount).eq(0);

    const idle = resolveOnIdle(test.operatorFun);
    test.executeFunFinishTrigger.next();

    await idle;

    expect(onComplete.callCount).eq(1);

    await test.processed.toPromise();
  });

  it("should send error event on exception in execute function", async () => {

    const errorMessage = "simulated error in executor function";
    const executorFun = async () => { throw new Error(errorMessage); };
    const test = setup(executorFun);

    const onNext = spy((x: any) => x);
    const onComplete = spy(noop);

    test.processed.subscribe(onNext, expectNoCall, onComplete);

    test.source.next(0);
    test.source.complete();

    await test.processed.toPromise();

    expect(onNext.callCount).eq(2);
    expect(onComplete.callCount).eq(1);

    expect(onNext.returnValues[0]).instanceOf(StartedEvent);
    expect((onNext.returnValues[0] as StartedEvent<number>).input).eq(0);
    expect(onNext.returnValues[1]).instanceOf(ErrorEvent);
    expect((onNext.returnValues[1] as ErrorEvent<number>).input).eq(0);
    expect((onNext.returnValues[1] as ErrorEvent<number>).error).instanceOf(Error);
    expect(((onNext.returnValues[1] as ErrorEvent<number>).error as Error).message).eq(errorMessage);
  });

  it("should forward error of source observable", async () => {

    const errorMessage = "simulated error in executor function";
    const test = setupWithTriggeredExecuteFun();

    const onError = spy((x: any) => x);

    test.processed.subscribe(expectNoCall, onError, expectNoCall);

    test.source.error(errorMessage);

    try {
      await test.processed.toPromise();
    } catch (e) {
      expect(e).eq(errorMessage);

      expect(onError.callCount).eq(1);
      expect(onError.returnValues[0]).eq(errorMessage);

      return;
    }

    throw new Error("should not run here, exception expected");

  });
});

function noop() {}

function expectNoCall(...args: any[]) {
  const message = "should not be called in this test";
  console.error(message, args);
  throw new Error(message);
}

function setupWithTriggeredExecuteFun() {
  const executeFunFinishTrigger = new Subject<void>();

  const executeFun = spy(async (x: number) => {
    console.log(`executeFun called with ${x}`);
    await executeFunFinishTrigger.pipe(take(1)).toPromise();
    console.log(`executeFun finished for ${x}`);
  });

  const test = setup(executeFun);

  return {
    executeFunFinishTrigger,
    executeFun: executeFun,
    source: test.source,
    operatorFun: test.operatorFun,
    processed: test.processed
  };
}

function setup(executeFun: (x: number) => Promise<void>) {
  const source = new Subject<number>();

  const operatorFun = executeLatestOnIdle(executeFun);
  const processed = source.pipe(
      operatorFun,
      share()
  );

  return {
    executeFun,
    source,
    operatorFun,
    processed
  };
}

async function resolveOnIdle(operatorFun: OperateFunction<any, any>) {
  await operatorFun.idle.pipe(filter(x => x), take(1)).toPromise();
}
