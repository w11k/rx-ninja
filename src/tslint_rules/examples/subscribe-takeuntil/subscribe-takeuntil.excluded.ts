import {of} from "rxjs";
import {map} from "rxjs/operators";

// Error
of(1).pipe(map(i => i)).subscribe();
