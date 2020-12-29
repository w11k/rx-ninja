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
export function deepEqual(obj1: any, obj2: any, maxDepth: number, actualDepth: number = 0) {

    if (obj1 === obj2) {
        return true;
    }

    if (isPrimitive(obj1) && isPrimitive(obj2)) {
        return obj1 === obj2;
    }

    // TODO bail here or check keys.length first?
    if (actualDepth === maxDepth) {
        return true;
    }

    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
    }

    for (let key in obj1) {
        if (!(key in obj2)) {
            return false;
        }
        if (!deepEqual(obj1[key], obj2[key], maxDepth, actualDepth + 1)) {
            return false;
        }
    }

    return true;
}

//check if value is primitive
function isPrimitive(obj: any) {
    return (obj !== Object(obj));
}
