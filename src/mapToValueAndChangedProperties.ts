import {Observable} from "rxjs";
import {map, pairwise, startWith} from "rxjs/operators";

export function mapToValueAndChangedProperties<T>(): (source: Observable<T>) => Observable<[T, Partial<T>]> {
    return source => source.pipe(
        startWith({}),
        pairwise(),
        map(([v1, v2]: [any, any]) => {
            const changed: any = {};
            for (let p in v2) {
                if (v2.hasOwnProperty(p) && v1[p] !== v2[p]) {
                    changed[p] = v2[p];
                }
            }
            return [v2, changed] as any;
        })
    );
}
