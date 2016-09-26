# Change Log
All notable changes to this project will be documented in this file.
This project adheres to the Node default version scheme, meaning It's safe to use with the caret ^ dependency definition.
The standard for the caret can [be found here](https://docs.npmjs.com/misc/semver#caret-ranges-123-025-004).
Breaking changes result in a different major. UI changes that might break customizations on top of the sdk, will be treated as breaking changes too.

## [New version]

### Added
- Internal: The document capture step now has a strategy to cope with slow responses from the server when requesting to validate documents. If the number of unprocessed documents is 3+, it stops sending more until a response is given.

### Changed
- Internal: Updated to `onfido-sdk-core@0.6.0`, which has some changed apis and can now store information on which documents are unprocessed

## [0.7.0]

### Changed
- Public: `onComplete` event now fires only after both the document and face captures have been confirmed in the UI
- Internal: updated `onfido-sdk-core` to 0.5.0 which causes the all capture event to be triggered when captured are both valid and confirmed
- Internal: made the confirm button change the state of the capture to confirmed

### Fixed
- Internal: sometimes when document was retaken multiple times the capture ended up squashed. This was fixed by upgrading to `react-webcam@0.0.14`.
- Internal: fixed [Bug #36](https://github.com/onfido/onfido-sdk-ui/issues/36), it caused the face to be captured every second after a document retake.


## [0.6.1]

### Changed
- Public: `Onfido.init()` now returns an object.
- Internal: `isDesktop` detection is now based on [DetectRTC][detectrtc]'s `isMobile` detection
- Internal: improved Webcam Detection, it now takes into account wether a Webcam exists and if it the user has given the website permission to use it. Before it was only checking whether the **getUserMedia** API is supported by the browser or not. [DetectRTC][detectrtc] is used for this detection.

### Added
- Public: it's now possible to change the init options at runtime by calling `setOptions()` on the object returned by `Onfido.init()`
- Public: `useWebcam` option added to the facial and document capture step

[detectrtc]: https://github.com/muaz-khan/DetectRTC


## [0.5.1]
### Fix
- SDK Core dependency update, fixes issue https://github.com/onfido/onfido-sdk-ui/issues/25
**Note:** This update only changes the dist folder release, npm releases get the dependency update if they do `npm install`


## [0.5.0]
### Added
- API: Flow customization option `steps:[]`
- UI: Overlay to the webcam document capture (**Possibly breaking change**)
- DOC: Integration examples to documentation
### Fixed
- NPM (commonjs2) style of importing the library now works


The standard for this change log can be found [here](http://keepachangelog.com/).

[0.7.0]: https://github.com/onfido/onfido-sdk-ui/compare/0.5.1...0.7.0
[0.6.1]: https://github.com/onfido/onfido-sdk-ui/compare/0.5.1...0.6.1
[0.5.1]: https://github.com/onfido/onfido-sdk-ui/compare/0.5.0...0.5.1
[0.5.0]: https://github.com/onfido/onfido-sdk-ui/compare/0.4.0...0.5.0
