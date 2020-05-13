
[![Build Status](https://travis-ci.org/w11k/rx-ninja.svg?branch=master)](https://travis-ci.org/w11k/rx-ninja)
[![npm version](https://badge.fury.io/js/%40w11k%2Frx-ninja.svg)](https://badge.fury.io/js/%40w11k%2Frx-ninja)

# rx-ninja

Utilities for RxJS. Provides additional operators as well as tslint rules to avoid common mistakes.

## API Documentation

Please see [API documentation](https://w11k.github.io/rx-ninja/index.html)

## Operators

* [combineLatestToMap](https://w11k.github.io/rx-ninja/modules/_operators_combine_latest_to_map_.html)
* [debounceIf](https://w11k.github.io/rx-ninja/modules/_operators_debounce_if_.html)
* [executeLatestOnIdle](https://w11k.github.io/rx-ninja/modules/_operators_execute_latest_on_idle_.html)
* [mapToValueAndChangedProperties](https://w11k.github.io/rx-ninja/modules/_operators_map_to_value_and_changed_properties_.html)
* [onCompletionContinueWith](https://w11k.github.io/rx-ninja/modules/_operators_on_completion_continue_with_.html)
* [onlyInstanceOf](https://w11k.github.io/rx-ninja/modules/_operators_only_instance_of_.html)
* [onUnsubscribe](https://w11k.github.io/rx-ninja/modules/_operators_on_unsubscribe_.html)
* [replayOn](https://w11k.github.io/rx-ninja/modules/_operators_replay_on_.html)
* [skipNil](https://w11k.github.io/rx-ninja/modules/_operators_skip_nil_.html)
* [skipNull](https://w11k.github.io/rx-ninja/modules/_operators_skip_null_.html)
* [skipPathNil](https://w11k.github.io/rx-ninja/modules/_operators_skip_path_nil_.html)
* [skipPropertyNil](https://w11k.github.io/rx-ninja/modules/_operators_skip_property_nil_.html)
* [skipPropertyNull](https://w11k.github.io/rx-ninja/modules/_operators_skip_property_null_.html)
* [skipPropertyUndefined](https://w11k.github.io/rx-ninja/modules/_operators_skip_property_undefined_.html)
* [skipSomePropertyNil](https://w11k.github.io/rx-ninja/modules/_operators_skip_some_property_nil_.html)
* [skipSomePropertyNull](https://w11k.github.io/rx-ninja/modules/_operators_skip_some_property_null_.html)
* [skipSomePropertyUndefined](https://w11k.github.io/rx-ninja/modules/_operators_skip_some_property_undefined_.html)
* [skipUndefined](https://w11k.github.io/rx-ninja/modules/_operators_skip_undefined_.html)
* [skipUntilCompletionAndContinueWith](https://w11k.github.io/rx-ninja/modules/_operators_skip_until_completion_and_continue_with_.html)
* [takeUntilCompletion](https://w11k.github.io/rx-ninja/modules/_operators_take_until_completion_.html)

Please use the API documentation for an always up-to-date list of all included operators.
The API documentation also contains detailed descriptions, examples and marble diagrams. 

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

The rule can be limited to files with the specified suffix (`fileSuffix`). Angular users might set this to `.component.ts`.

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
            "-relevant.ts"
        ]
    }
]
```


**rx-ninja-subscribe-in-subscribe**

This rule triggers if `Observable#subscribe()` is called inside of another `Observable#subscribe()` call, e.g.

```typescript
import {of} from "rxjs";

of(1).subscribe(() => {
    of(2).subscribe(); // <-- error
});
```

## Utilities

* [AsyncPrioritizedQueue](https://w11k.github.io/rx-ninja/modules/_utils_async_prioritized_queue_.html)
* [entries](https://w11k.github.io/rx-ninja/modules/_utils_functions_.html#entries)

## Patrons

❤️ [W11K - The Web Engineers](https://www.w11k.de/)

❤️ [theCodeCampus - Trainings for Angular and TypeScript](https://www.thecodecampus.de/)
