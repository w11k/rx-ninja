# Version 1.10.1

- fix missing export

# Version 1.10.0

- add AsyncPrioritizedQueue

# Version 1.9.2

- restore tslint rules

# Version 1.9.1

- fixed documentation bugs
- restore isNil

# Version 1.9.0

- improved documentation
- improved tests
- new operator executeLatestOnIdle
- new operator justInstanceOf

# Version 1.8.2

- fixed bug in `notUndefined`


# Version 1.8.1

- fixed wrong linter file names


# Version 1.8.0

- renamed lint rules
    - `w11k-rxjs-subscribe-in-subscribe` to `rx-ninja-subscribe-in-subscribe`
    - `w11k-rxjs-subscribe-takeuntil` to `rx-ninja-subscribe-takeuntil`
- Added configuration option to lint rule `rx-ninja-subscribe-takeuntil` to allow custom terminator operators 


# Version 1.7.0 - new name rx-ninja

- added operator onCompletionContinueWith

# Version 1.6.0

- added SignalSubject
- added operator replayOn


# Version 1.5.0

- added tslint rule w11k-rxjs-subscribe-in-subscribe


# Version 1.4.3

- added error on use of deprecated method untilComponentDestroyed 
- added missing dependency @phenomnomnominal/tsquery


# Version 1.4.1

- w11k-rxjs-subscribe-takeuntil triggers now also triggers outside classes


# Version 1.4.0

- added TSLint rule: w11k-rxjs-subscribe-takeuntil


# Version 1.3.1

- fixed CallableSubject


# Version 1.3.0

- added TransformingSubject


# Version 1.2.2

- fixed: CallableSubject, function's prototype methods were not preserved


# Version 1.2.0

- added CallableSubject


# Version 1.1.0

- added `debounceIf`


# Version 1.0.0

initial release
