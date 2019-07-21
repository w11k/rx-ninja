
[![Build Status](https://travis-ci.org/w11k/rx-ninja.svg?branch=master)](https://travis-ci.org/w11k/rx-ninja)
[![npm version](https://badge.fury.io/js/%40w11k%2Frx-ninja.svg)](https://badge.fury.io/js/%40w11k%2Frx-ninja)

# rx-ninja

Utilities for RxJS. Provides additional operators as well as tslint rules to avoid common mistakes.

## API Documentation

Please see [API documentation](https://w11k.github.io/rx-ninja/modules/_index_.html)

## Operators

* combineLatestToMap
* debounceIf
* executeLatestOnIdle
* justInstanceOf
* mapToValueAndChangedProperties
* onCompletionContinueWith
* replayOn
* skipNil
* skipNull
* skipPropertyNil
* skipPropertyNull
* skipPropertyUndefined
* skipSomePropertyNil
* skipSomePropertyNull
* skipSomePropertyUndefined
* skipUndefined
* skipUntilCompletionAndContinueWith

Please use the API documentation for an always up-to-date list of all included operators.
The API documentation also contains detailed descriptions, examples and marble diagrams. 

## TSLint rules

### Installation 

**Adjust your tslint.json**

```
{
  "rulesDirectory": [
    "node_modules/@w11k/rx-ninja/dist/tslint_rules"
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

This rule triggers if `Observable#subscribe()` is called and then enforces that 

- `.pipe()` is called directly before `.subscribe()`
- and that either `takeUntil()` or one of a specified terminator operator is called as the last pipe operator

*Configuration:*

```
"rx-ninja-subscribe-takeuntil": [true, "takeUntil", "customOperator", "anotherOperator"]
```


**rx-ninja-subscribe-in-subscribe**

This rule triggers if `Observable#subscribe()` is called inside of another `Observable#subscribe()` call, e.g.

```typescript
import {of} from "rxjs";

of(1).subscribe(() => {
    of(2).subscribe(); // <-- error
});
```

**Patrons**

❤️ [W11K - The Web Engineers](https://www.w11k.de/)

❤️ [theCodeCampus - Trainings for Angular and TypeScript](https://www.thecodecampus.de/)
