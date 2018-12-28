
[![Build Status](https://travis-ci.org/w11k/rx-ninja.svg?branch=master)](https://travis-ci.org/w11k/rx-ninja)
[![npm version](https://badge.fury.io/js/%40w11k%2Frx-ninja.svg)](https://badge.fury.io/js/%40w11k%2Frx-ninja)

# rx-ninja

Utilities for RxJS

**Patrons**

❤️ [W11K - The Web Engineers](https://www.w11k.de/)

❤️ [theCodeCampus - Trainings for Angular and TypeScript](https://www.thecodecampus.de/)


## API Documentation

🗄 [TypeDoc online API documentation](https://w11k.github.io/rx-ninja/modules/_index_.html)

Operator|Description
--|--
debounceIf|Debounce values on the stream if the predicate returns true


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
- and that `takeUntil()` is called as the last pipe operator


**rx-ninja-subscribe-in-subscribe**

This rule triggers if `Observable#subscribe()` is called inside of another `Observable#subscribe()` call, e.g.

```typescript
import {of} from "rxjs";

of(1).subscribe(() => {
    of(2).subscribe(); // <-- error
});
```
