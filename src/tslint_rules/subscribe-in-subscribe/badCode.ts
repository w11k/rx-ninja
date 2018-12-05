import {of} from "rxjs";

const obs = of(2);

// ok
of(1).subscribe(() => {
});

// error
of(1).subscribe(() => {
    obs.subscribe();
});
