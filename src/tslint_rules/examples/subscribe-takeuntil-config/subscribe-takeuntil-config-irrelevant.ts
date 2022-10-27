import { of } from "rxjs";
import { map, takeUntil } from "rxjs/operators";

class SubscribeTakeuntilConfig {

  stop = of(1);

  constructor() {
    // Error
    of(1).pipe(
        map(i => i),
        takeUntil(this.stop),
        map(i => i),
    ).subscribe();
  }

}
