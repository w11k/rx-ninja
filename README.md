[![Build Status](https://travis-ci.org/w11k/rx-ninja.svg?branch=master)](https://travis-ci.org/w11k/rx-ninja)
[![npm version](https://badge.fury.io/js/%40w11k%2Frx-ninja.svg)](https://badge.fury.io/js/%40w11k%2Frx-ninja)

# rx-ninja

Utilities for RxJS. Provides additional operators as well as tslint rules to avoid common mistakes.

## API Documentation

Please see [API documentation](https://w11k.github.io/rx-ninja/index.html)

## Operators

* [combineLatestToMap](https://w11k.github.io/rx-ninja/modules.html#combinelatesttomap)
* [debounceIf](https://w11k.github.io/rx-ninja/modules.html#debounceif)
* [distinctUntilChangedDeep](https://w11k.github.io/rx-ninja/modules.html#distinctuntilchangeddeep)
* [executeLatestOnIdle](https://w11k.github.io/rx-ninja/modules.html#executelatestonidle)
* [mapToValueAndChangedProperties](https://w11k.github.io/rx-ninja/modules.html#maptovalueandchangedproperties)
* [onCompletionContinueWith](https://w11k.github.io/rx-ninja/modules.html#oncompletioncontinuewith)
* [onlyInstanceOf](https://w11k.github.io/rx-ninja/modules.html#onlyinstanceof)
* [onUnsubscribe](https://w11k.github.io/rx-ninja/modules.html#onunsubscribe)
* [replayOn](https://w11k.github.io/rx-ninja/modules.html#replayon)
* [rateLimitLossless + rateLimitLossy](https://w11k.github.io/rx-ninja/modules.html#ratelimit)
* [shareReplayUntilAllUnsubscribed](https://w11k.github.io/rx-ninja/modules.html#sharereplayuntilallunsubscribed)
* [skipNil](https://w11k.github.io/rx-ninja/modules.html#skipnil)
* [skipNull](https://w11k.github.io/rx-ninja/modules.html#skipnull)
* [skipPathNil](https://w11k.github.io/rx-ninja/modules.html#skippathnil)
* [skipPropertyNil](https://w11k.github.io/rx-ninja/modules.html#skippropertynil)
* [skipPropertyNull](https://w11k.github.io/rx-ninja/modules.html#skippropertynull)
* [skipPropertyUndefined](https://w11k.github.io/rx-ninja/modules.html#skippropertyundefined)
* [skipSomePropertyNil](https://w11k.github.io/rx-ninja/modules.html#skipsomepropertynil)
* [skipSomePropertyNull](https://w11k.github.io/rx-ninja/modules.html#skipsomepropertynull)
* [skipSomePropertyUndefined](https://w11k.github.io/rx-ninja/modules.html#skipsomepropertyundefined)
* [skipUndefined](https://w11k.github.io/rx-ninja/modules.html#skipundefined)
* [skipUntilCompletionAndContinueWith](https://w11k.github.io/rx-ninja/modules.html#skipuntilcompletionandcontinuewith)
* [startWith](https://w11k.github.io/rx-ninja/modules.html#startwith)
* [takeUntilCompletion](https://w11k.github.io/rx-ninja/modules.html#takeuntilcompletion)

Please use the API documentation for an always up-to-date list of all included operators. The API documentation also contains detailed descriptions, examples
and marble diagrams.

## TSLint rules

### Installation

**Adjust your tslint.json**

```
{
  "rulesDirectory": [
    "node_modules/@w11k/rx-ninja/dist/bundle/tslint_rules"
  ],
  "rules": {
    "rx-ninja-subscribe-takeuntil": true,
    "rx-ninja-subscribe-in-subscribe": true
  }
}
```

**Run tslint with type info**

```
tslint -p tsconfig.json -t verbose
```

### Rule descriptions

**rx-ninja-subscribe-takeuntil**

This rule triggers when `Observable#subscribe()` is called and then enforces that

- `.pipe()` is called directly before `.subscribe()`
- and that either `takeUntil()` or one of a specified finalizer operators is called as the last pipe operator

You can filter the files where this rules applies with `fileSuffix` and `excludedFileSuffix`.

*Configuration:*

```
"rx-ninja-subscribe-takeuntil": [
    true,
    {
        "finalizer": [
            "takeUntil",
            "customOperator",
            "anotherOperator"
        ],
        "fileSuffix": [
            ".ts"
        ],
        "excludedFileSuffix": [
          ".spec.ts",
          ".test.ts"
        ]
    }
]
```

**rx-ninja-subscribe-in-subscribe**

This rule triggers when `Observable#subscribe()` is called inside another `Observable#subscribe()` call, e.g.

```typescript
import {of} from "rxjs";

of(1).subscribe(() => {
    of(2).subscribe(); // <-- error
});
```

## Utilities

* [AsyncPrioritizedQueue](https://w11k.github.io/rx-ninja/classes/asyncprioritizedqueue.html)
* [entries](https://w11k.github.io/rx-ninja/modules.html#entries)

## Patrons

❤️ [W11K - The Web Engineers](https://www.w11k.de/)

❤️ [theCodeCampus - Trainings for Angular and TypeScript](https://www.thecodecampus.de/)

## Thanks

* Diagram generation from [RxJS](https://rxjs-dev.firebaseapp.com/)
