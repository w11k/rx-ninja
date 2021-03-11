import {expect} from "chai";
import {Observable, Subject} from "rxjs";
import {spy} from "sinon";
import {shareReplayUntilAllUnsubscribed} from "./share-replay-until-all-unsubscribed";

describe("shareReplayUntilAllUnsubscribed", () => {
  it("should subscribe to source only once for multiple simultaneous subscriber", () => {
    const onSubscriberMock = spy();

    const source = new Observable<number>(onSubscriberMock);

    const sourcePiped = source.pipe(
      shareReplayUntilAllUnsubscribed()
    );

    sourcePiped.subscribe(x => {});
    sourcePiped.subscribe(x => {});

    expect(onSubscriberMock.callCount).eq(1);
  });

  it("should unsubscribe from source when all subscriber unsubscribe", () => {
    const teardownMock = spy();
    const onSubscriberMock = spy(() => teardownMock);

    const source = new Observable<number>(onSubscriberMock);

    const sourcePiped = source.pipe(
      shareReplayUntilAllUnsubscribed()
    );

    const subscription1 = sourcePiped.subscribe(x => {});
    const subscription2 = sourcePiped.subscribe(x => {});

    subscription1.unsubscribe();
    expect(teardownMock.callCount).eq(0);

    subscription2.unsubscribe();
    expect(teardownMock.callCount).eq(1);
  });

  it("should forward complete", () => {
    const source = new Subject<number>();

    const sourcePiped = source.pipe(
      shareReplayUntilAllUnsubscribed()
    );

    const noop = spy();
    const onComplete = spy();
    sourcePiped.subscribe(noop, noop, onComplete);

    source.complete();
    expect(onComplete.callCount).eq(1);
    expect(noop.callCount).eq(0);
  });

  it("should forward error", () => {
    const source = new Subject<number>();

    const sourcePiped = source.pipe(
      shareReplayUntilAllUnsubscribed()
    );

    const noop = spy();
    const onError = spy();
    sourcePiped.subscribe(noop, onError, noop);

    source.error(false);
    expect(onError.callCount).eq(1);
    expect(onError.calledWith(false)).true;
    expect(noop.callCount).eq(0);
  });

  it("should replay latest value when already subscribed to source", () => {
    const source = new Subject<number>();

    const sourcePiped = source.pipe(
      shareReplayUntilAllUnsubscribed()
    );

    const next1 = spy();
    sourcePiped.subscribe(next1);

    source.next(1);
    expect(next1.callCount).eq(1);
    expect(next1.calledWith(1)).true;

    source.next(2);
    expect(next1.callCount).eq(2);
    expect(next1.calledWith(2)).true;

    const next2 = spy();
    sourcePiped.subscribe(next2);

    expect(next2.callCount).eq(1);
    expect(next2.calledWith(2)).true;

    source.complete();
  });

  it("should not replay maybe outdated value (new subscriber after all subscriber unsubscribed)", () => {
    const source = new Subject<number>();

    const sourcePiped = source.pipe(
      shareReplayUntilAllUnsubscribed()
    );

    const next1 = spy();
    const subscription1 = sourcePiped.subscribe(next1);

    source.next(1);
    expect(next1.calledWith(1)).true;

    subscription1.unsubscribe();

    const next2 = spy();
    sourcePiped.subscribe(next2);

    expect(next2.callCount).eq(0);

    source.complete();
  });

  it("should replay error after all subscriber unsubscribed", () => {
    const source = new Subject<number>();

    const sourcePiped = source.pipe(
        shareReplayUntilAllUnsubscribed()
    );

    const noop1 = spy();
    const onError1 = spy();
    const subscription1 = sourcePiped.subscribe(noop1, onError1, noop1);

    source.error(false);

    subscription1.unsubscribe();

    const noop2 = spy();
    const onError2 = spy();
    sourcePiped.subscribe(noop2, onError2, noop2);

    expect(onError2.callCount).eq(1);
    expect(onError2.calledWith(false)).true;
    expect(noop2.callCount).eq(0);
  });

  it("should replay error after all subscriber unsubscribed", () => {
    const source = new Subject<number>();

    const sourcePiped = source.pipe(
        shareReplayUntilAllUnsubscribed()
    );

    const noop1 = spy();
    const onComplete1 = spy();
    const subscription1 = sourcePiped.subscribe(noop1, noop1, onComplete1);

    source.complete();

    subscription1.unsubscribe();

    const noop2 = spy();
    const onComplete2 = spy();
    sourcePiped.subscribe(noop2, noop2, onComplete2);

    expect(onComplete2.callCount).eq(1);
    expect(noop2.callCount).eq(0);
  });

  it("should not replay values after error", () => {
    const source = new Subject<number>();

    const sourcePiped = source.pipe(
      shareReplayUntilAllUnsubscribed()
    );

    const noop1 = spy();
    const onError1 = spy();
    sourcePiped.subscribe(noop1, onError1, noop1);

    source.next(1);
    source.error(false);

    const noop2 = spy();
    const onError2 = spy();
    noop2.named("noop2");
    sourcePiped.subscribe(noop2, onError2, noop2);

    expect(noop2.callCount).eq(0);
  });

  it("should not replay values after complete", () => {
    const source = new Subject<number>();

    const sourcePiped = source.pipe(
      shareReplayUntilAllUnsubscribed()
    );

    const noop1 = spy();
    sourcePiped.subscribe(noop1);

    source.next(1);
    source.complete();

    const noop2 = spy();
    noop2.named("noop2");
    sourcePiped.subscribe(noop2);

    expect(noop2.callCount).eq(0);
  });
});
