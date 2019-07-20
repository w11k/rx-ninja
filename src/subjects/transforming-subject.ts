import {Observable, Observer, OperatorFunction, Subject} from "rxjs";

export type TransformingSubject<I, O> = Observer<I> & Observable<O>;

/**
 * TODO: add documentation
 *
 * @param subject
 * @param operator
 */
export function createTransformingSubject<I, O>(subject: Subject<I>,
                                                operator: OperatorFunction<I, O>): TransformingSubject<I, O> {

    const observable: Observable<O> = subject.asObservable().pipe(operator);
    const observer: Observer<I> = {
        next: subject.next.bind(subject),
        error: subject.error.bind(subject),
        complete: subject.complete.bind(subject)
    };
    Object.defineProperty(observer, "closed", {
        get: () => subject.closed
    });

    return Object.assign(observable, observer);
}
