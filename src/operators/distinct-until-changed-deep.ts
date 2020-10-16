import { Observable } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

/**
 * Emit only new values if the value changes in a deep equal comparison.
 *
 * <img src="media://distinct-until-changed-deep.svg" alt="marble">
 */
export function distinctUntilChangedDeep() {
    return function operatorFunction<T>(source: Observable<T>) {
        return source.pipe(
            distinctUntilChanged(deepEqual)
        );
    };
}

/** thanks to Daniil Andreyevich Baunov https://stackoverflow.com/a/45683145/6081477 */
function deepEqual(obj1: any, obj2: any) {

    if (obj1 === obj2) {
        return true;
    }

    // compare primitives
    if (isPrimitive(obj1) && isPrimitive(obj2)) {
        return obj1 === obj2;
    }

    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
    }

    // compare objects with same number of keys
    for (let key in obj1) {
        if (!(key in obj2)) {
            return false;
        } //other object doesn't have this prop
        if (!deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

//check if value is primitive
function isPrimitive(obj: any) {
    return (obj !== Object(obj));
}
