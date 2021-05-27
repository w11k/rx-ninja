import { Observable } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

/**
 * Emit only new values if the value changes in a deep equal comparison.
 *
 * @param maxDepth of iteration to determine if datastructures are equal. When you intend to iterate over all
 *        properties regardless of depth use INFINITY. A depth of 0 uses the same comparison as distinctUntilChanged.
 *
 * <img src="media://distinct-until-changed-deep.svg" alt="marble">
 */
export function distinctUntilChangedDeep(maxDepth: number) {
    return function operatorFunction<T>(source: Observable<T>) {
        if (maxDepth < 0) {
            throw new Error(`use a positive max iteration depth or 0`);
        }
        return source.pipe(
            distinctUntilChanged((a, b) => deepEqual(a, b, maxDepth, 0))
        );
    };
}

/** thanks to Daniil Andreyevich Baunov https://stackoverflow.com/a/45683145/6081477 */
export function deepEqual(a: any, b: any, maxDepth: number, actualDepth: number = 0) {
    if (a === b) {
        return true;
    }

    if (isPrimitive(a) && isPrimitive(b)) {
        return a === b;
    }

    if (actualDepth === maxDepth) {
        return true;
    }

    if (Object.keys(a).length !== Object.keys(b).length) {
        return false;
    }

    for (let key in a) {
        if (!(key in b)) {
            return false;
        }
        if (!deepEqual(a[key], b[key], maxDepth, actualDepth + 1)) {
            return false;
        }
    }

    return true;
}

//check if value is primitive
function isPrimitive(obj: any) {
    return (obj !== Object(obj));
}
