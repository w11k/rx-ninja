import {Observable, Observer, OperatorFunction, Subject} from "rxjs";

function identity<T>(obj: T): T {
    return obj;
}

function delegateAllProperties(target: any, source: any) {
    // tslint:disable-next-line:forin
    for (const propName in source) {
        // noinspection JSUnfilteredForInLoop
        let prop = source[propName];
        if (typeof prop === "function") {
            prop = prop.bind(source);
        }

        let sourcePropDesc: PropertyDescriptor | undefined;
        while (sourcePropDesc === undefined && source !== undefined) {
            // noinspection JSUnfilteredForInLoop
            sourcePropDesc = Object.getOwnPropertyDescriptor(source, propName);
            if (sourcePropDesc === undefined) {
                source = Object.getPrototypeOf(source);
            }
        }

        if (sourcePropDesc !== undefined) {
            if (sourcePropDesc.get !== undefined) {
                sourcePropDesc.get = () => prop;
            }

            // noinspection JSUnfilteredForInLoop
            Object.defineProperty(target, propName, sourcePropDesc);
        }
    }
}

export type CallableSubject<I, O> = I extends undefined
    ? (() => void) & Observable<undefined> & Observer<undefined>
    : ((value: I) => void) & Observable<O> & Observer<I>;

export function createCallableSubject<I>(): CallableSubject<I, I>;
export function createCallableSubject<I, O>(base: Subject<I>): CallableSubject<I, I>;
export function createCallableSubject<I, O>(base: Subject<I>, operator: OperatorFunction<I, O>): CallableSubject<I, O>;

export function createCallableSubject<I, O>(subject: Subject<I> = new Subject(),
                                            operator: OperatorFunction<I, O> = identity as any): CallableSubject<I, O> {

    const callable = (value: I) => {
        subject.next(value);
    };

    const observable: Observable<O> = subject.asObservable().pipe(operator);
    const fnMethods: Partial<Function> = {
        bind: callable.bind.bind(callable),
        apply: callable.apply.bind(callable),
        call: callable.call.bind(callable),
        length: callable.length,
        name: callable.name
    };
    delegateAllProperties(callable, fnMethods);
    delegateAllProperties(callable, subject);
    delegateAllProperties(callable, observable);

    // Required! Otherwise this CallableSubject could not be used with e.g. `takeUntil()`
    Object.setPrototypeOf(callable, observable);

    return callable as any;
}

export function createSignalSubject() {
    return createCallableSubject<undefined>();
}
