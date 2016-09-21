# Change Log
All notable changes to this project will be documented in this file.
This project adheres to the Node default version scheme, meaning It's safe to use with the caret ^ dependency definition.
The standard for the caret can [be found here](https://docs.npmjs.com/misc/semver#caret-ranges-123-025-004).
Breaking changes result in a different major. UI changes that might break customizations on top of the sdk, will be treated as breaking changes too.


## [New version]


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

[0.5.0]: https://github.com/onfido/onfido-sdk-core/compare/0.4.1...0.5.0
[0.4.1]: https://github.com/onfido/onfido-sdk-core/compare/0.4...0.4.1
[0.4]: https://github.com/onfido/onfido-sdk-core/compare/0.3.2...0.4
