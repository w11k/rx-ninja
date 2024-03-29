# rx-ninja Changelog

## 5.0.0

* update dependencies
* remove ts-lint rules
* use ES-Lint

## 4.5.3

* renamed all function parameters with name 'x' to e.g. 'val' to avoid IntelliJ's smart error messages like "'height' should probably not be passed as parameter 'x'"

## 4.4.1

* fix shareReplayUntilAllUnsubscribed not exposed in index.ts

## 4.4.0

* add shareReplayUntilAllUnsubscribed operator

## 4.3.0

* Allows to exclude file from lint rule rx-ninja-subscribe-takeuntil. Closes #8.


## 4.2.2

* support for TypeScript 4


## 4.2.1

* fix publishing with broken folder structure

## 4.2.0

* update to typescript 3.9
* fix imports from rxjs/internal
* add operator ```destinctUntilChangedDeep```
* add marble diagrams to documentation

## 4.1.0

* ```onUnsubscribe``` operator added

## Version 4.0.3

* The documentation of the ```combineLatestToMap``` operator was corrected

## Version 4.0.0 to 4.0.2

* Breaking Change: changed signature of skipUndefined

  before: ```skipUndefined```
  after: ```skipUndefined()```
  
* removed deprecated aliases
  * ```justInstanceOf```, use ```onlyInstanceOf``` instead
  * ```notNil```, use ```isNotNil``` instead
  * ```notNull```, use ```isNotNull``` instead
  * ```notUndefined```, use ```isNotUndefined``` instead
  * ```propertyNotNil```, use ```isPropertyNotNil``` instead
  * ```propertyNotNull```, use ```isPropertyNotNull``` instead
  * ```propertyNotUndefined```, use ```isPropertyNotUndefined``` instead
  * ```propertiesNotNil```, use ```hasNoNilProperties``` instead
  * ```propertiesNotNull```, use ```hasNoNullProperties``` instead
  * ```propertiesNotUndefined```, use ```hasNoUndefinedProperties``` instead
  
* added operator ```takeUntilCompletion```

## Version 3.1.0

* added isPathNotNil function and skipPathNil operator
* added overloaded isPropertyNil with object as first parameter, for usage in if statements 

## Version 3.0.0

- The configuration for TSLint rule "rx-ninja-subscribe-takeuntil" changed. It is now possible to specify the relevant file name suffixes. This is useful for Angular applications:

  ```json
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

- added deprecated alias propertyNotNil for isPropertyNotNil


## Version 2.0.0

- several operator and predicate function names were changed
- old names are still available but deprecated

## Version 1.10.2

- provides ESM5 and ESM2015 bundle

## Version 1.10.1

- fix missing export

## Version 1.10.0

- add AsyncPrioritizedQueue

## Version 1.9.2

- restore tslint rules

## Version 1.9.1

- fixed documentation bugs
- restore isNil

## Version 1.9.0

- improved documentation
- improved tests
- new operator executeLatestOnIdle
- new operator justInstanceOf

## Version 1.8.2

- fixed bug in `notUndefined`


## Version 1.8.1

- fixed wrong linter file names


## Version 1.8.0

- renamed lint rules
    - `w11k-rxjs-subscribe-in-subscribe` to `rx-ninja-subscribe-in-subscribe`
    - `w11k-rxjs-subscribe-takeuntil` to `rx-ninja-subscribe-takeuntil`
- Added configuration option to lint rule `rx-ninja-subscribe-takeuntil` to allow custom terminator operators 


## Version 1.7.0 - new name rx-ninja

- added operator onCompletionContinueWith

## Version 1.6.0

- added SignalSubject
- added operator replayOn


## Version 1.5.0

- added tslint rule w11k-rxjs-subscribe-in-subscribe


## Version 1.4.3

- added error on use of deprecated method untilComponentDestroyed 
- added missing dependency @phenomnomnominal/tsquery


## Version 1.4.1

- w11k-rxjs-subscribe-takeuntil triggers now also triggers outside classes


## Version 1.4.0

- added TSLint rule: w11k-rxjs-subscribe-takeuntil


## Version 1.3.1

- fixed CallableSubject


## Version 1.3.0

- added TransformingSubject


## Version 1.2.2

- fixed: CallableSubject, function's prototype methods were not preserved


## Version 1.2.0

- added CallableSubject


## Version 1.1.0

- added `debounceIf`


## Version 1.0.0

initial release
