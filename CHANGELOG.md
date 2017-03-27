# Change Log
All notable changes to this project will be documented in this file.
This project adheres to the Node default version scheme, meaning It's safe to use with the caret ^ dependency definition.
The standard for the caret can [be found here](https://docs.npmjs.com/misc/semver#caret-ranges-123-025-004).
Breaking changes result in a different major. UI changes that might break customizations on top of the sdk, will be treated as breaking changes too.

## [next-version]

## [1.0.1]

### Changed
- Internal: Pass React component props to selectors.
- Public: Support capturing the reverse side of documents.


## [0.7.2] - Hotfix

### Fixed
- Public: Fixed an issue where the `getCaptures()` was returning a broken hash.


## [0.7.1]

### Changed
- Internal: Removed lodash, 50KB reduced from minified JS bundle file.
- Update the URL of the websockets server.

### Added
- Pass websockets URL to connect. Default to production.


## [0.7.0]

### Changed
- Events are only dispatched when condition has been met and also changed. Before events were getting dispatched every time the condition was met and the store changed (even if the condition hadn't changed).
- The events '(document|face)Capture' now gets called only when the capture has been confirmed.


## [0.6.0]

### Changed
- The action `validCapture` has been changed to `validateCapture`.
- The payload of the action `createCapture` has changed from `{...data: object}` to `{...capture: object}`.
- All selectors have now been changed from having identical pairs of selectors for both `document` and `face` to be capture type agnostic selectors, meaning they are now mapped into the captures hash which includes all capture types as keys.
- `faceSelector|documentSelector:[Object]` changed to `validCaptures:{string:[Object]}`
- `documentCaptured|faceCaptured:boolean` changed to `isThereAValidCapture:{string:boolean}`.
- `faceValidAndConfirmed|documentValidAndConfirmed:boolean` changed to `isThereAValidAndConfirmedCapture:{string:boolean}`


### Added
- The action `validateCapture` now also changes the value in the capture of the property `processed` to `true` whenever the action is called.
- The action `createCapture` can now accept a new optional parameter called `maxCaptures: int`, which determines how many captures are stored. The default of `maxCaptures` is `3`.
- The payload of the action `validateCapture` can have an extra parameter called `valid: boolean` which is optional and defaults to `true`, this can be used to invalidate the capture.
- There is a new selector called `unprocessedCaptures:{string:[Capture]}` which returns a list of captures which have not yet been been validated/invalidated for each capture type.
- There is a new selector `hasUnprocessedCaptures:{string:boolean}` which returns a boolean on whether there are unprocessed Captures for each capture type.
- There is a new selector `areAllCapturesInvalid:{string:boolean}` which returns a boolean on whether all of its captures are invalid for each capture type.
- Events are now sent for any capture type.
- The selector `allCaptured` is now capture type agnostic, but still backwards compatible.


## [0.5.0]

### Added
- the action `CAPTURE_CONFIRM` is now available, it expects a `payload.data.id` for determining which capture to confirm.

### Changed
- selector `allCaptured` and consequentially event `complete` are now only triggered when the captures are both validated and confirmed.


## [0.4.1]
### Fix
- the null exception when calling getCaptures() has been corrected.


## [0.4]
### Changed
- the specific actions for both document and face capture have been converged into one general capture action


The standard for this change log can be found [here](http://keepachangelog.com/).

[next-version]: https://github.com/onfido/onfido-sdk-core/compare/1.0.1...master
[1.0.1]: https://github.com/onfido/onfido-sdk-core/compare/0.7.2...1.0.1
[0.7.2]: https://github.com/onfido/onfido-sdk-core/compare/0.7.1...0.7.2
[0.7.1]: https://github.com/onfido/onfido-sdk-core/compare/0.7.0...0.7.1
[0.7.0]: https://github.com/onfido/onfido-sdk-core/compare/0.6.0...0.7.0
[0.6.0]: https://github.com/onfido/onfido-sdk-core/compare/0.5.0...0.6.0
[0.5.0]: https://github.com/onfido/onfido-sdk-core/compare/0.4.1...0.5.0
[0.4.1]: https://github.com/onfido/onfido-sdk-core/compare/0.4...0.4.1
[0.4]: https://github.com/onfido/onfido-sdk-core/compare/0.3.2...0.4
