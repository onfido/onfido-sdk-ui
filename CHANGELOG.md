# Change Log
All notable changes to this project will be documented in this file.

This change log file is based on best practices from [Keep a Changelog](http://keepachangelog.com/).  
This project adheres to [Semantic Versioning](http://semver.org/). Breaking changes result in a different MAJOR version. UI changes that might break customizations on top of the SDK will be treated as breaking changes too.  
This project adheres to the Node [default version scheme](https://docs.npmjs.com/misc/semver).  

## [next-version]

### Changed

- Removed `onDocumentCapture` that used to be fired when the document had been successfully captured, confirmed by the user and uploaded to the Onfido API
- Removed `onFaceCapture` callbacks that used to be fired when the face has beed successfully captured, confirmed by the user and uploaded to the Onfido API.
- Removed `getCaptures` function that used to return the document and face files captured during the flow.
- Changed the behaviour of `onComplete` callback. It used to return an object that contained all captures, now it doesn't return any data.

## [1.1.0]

### Added
- UI: Introducing glare detection feature for documents. Not available for documents in PDF format yet.
- Internal: Added confirm step to router history and tracking

### Changed
- UI: Improved how errors and warnings are displayed on the UI
- UI: Improved navigation between steps when using the browser navigation buttons
- Internal: Improved event tracking
- Internal: Upgraded Preact to latest version

## [1.0.0]

### Note
Bumping version to 1.0.0 because SDK has already been implemented in production integrations. Also SDK now integrates with [Onfido API](https://documentation.onfido.com).

### Changed
- Public: Support uploading documents and live photos to the Onfido API through use of new SDK tokens (JWT v2)

### Removed
- Public: Face no longer supports PDF upload in order to align with the Onfido API.

## [0.15.1]

### Fixed
- Internal: Fixed problem on certain versions of Firefox that no longer supported the old version of getUserMedia
- Internal: Fixed the `tearDown` method to clear the documents and faces currently in the store
- Internal: Fixed PDF preview issues on IE Edge, IE11 and mobile browsers.
- Internal: Fixed lower resolution webcams not working on Firefox

### Changed
- Internal: replaced the has_webcam checker with a more robust version that periodically checks if the state changed
- Internal: Increased the file size upper limit to 10 MB.


## [0.15.0]

### Changed
- Internal: Use HTTP protocol to post documents to the server instead of websockets

### Fixed
- Public: Fixed intermittent connection problem

## [0.14.0]

### Changed

- Public: Document and face captures will be returned by callbacks as File or Blob instead of base64.
- Internal: Callbacks are now linked to the flow rather than the Redux store.

### Added

- Public: Capture the reverse side of driving licenses and ID cards.
- Public: Add a file size limit of 4 MB in line with the Onfido API.

### Fixed
- Internal: Read exif tags to orientate images correctly.

## [0.13.0]

### Changed

- Public: Change the default to use file upload rather than the webcam for document captures.
- Internal: Fix dependencies to avoid bugs due to changes in minor updates.

## [0.12.0-rc.1]

Install with `npm install onfido-sdk-ui@0.12.0-rc.1`

### Changed
- Internal: Change the signature expected from the websockets server.

### Fixed
- Public: The documentType in the capture object now corresponds to the API document_types.
- Public: Fixed bug where URL path was removed between steps.

## [0.11.1] - Hotfix

### Fixed
- Public: Fixed bug where `Onfido.getCaptures()` and `onComplete(hash)` was returning a broken hash.
- Internal: Froze dependencies which were causing the upload document and pdf preview not to work.


## [0.11.0]

### Changed
- Internal: Removed `preact-router`.
- Public: Removed URL routes for each step of the SDK flow.
- Internal: Removed unused components - Dropdown and ActionBar.
- Internal: Use the staging backend when in development.
- Updated version of onfido-sdk-core to 0.7.1.

### Added
- Public: tearDown method to remove the SDK elements.


## [0.10.0]

### Changed
- Internal: Use `visibilityjs` to pause captures when the tab is inactive.
- Internal: The copy of the document not found error message was changed.
- Internal: Changed the order of the document selection to passport, driver's license and identity card.
- Public: The returned webcam captures now have a resolution of 960x720, or lower if the webcam does not support it.
- Internal: The confirmation step for webcam captures now displays the new high resolution images.
- Internal: Updated `react-webcam-onfido` in order to get the higher resolution functionality.

### Added
- Public: Uploaded PDF files are now supported and returned by the callbacks as base64.
- Internal: PDF files are displayed in the confirmation step as an embedded object, which means the browser needs to support pdf files in order for them to be visible.


## [0.9.0]

### Changed
- Public: document and face callback are now passed only their respective capture, instead of both their captures.
- Public: document and face callback are now only called after the user has confirmed the capture
- Public: document, face and complete callback can be called multiple times, if the condition that triggers them is met more than once (eg. if the user goes back to redo the capture steps)
- Internal: callbacks' returned value now have no impact on the event dispatcher.

### Fixed
- All captures have now a default no op function. This fixes an exception raise (in case some callbacks where not defined), which caused the rest of the callbacks not to be called after the exception was raised.


## [0.8.4]

### Fixed
- Updated `react-webcam` to the onfido fork, this fixes the issue where the webcam canvas (used to obtain screenshots) has 0 height under certain circumstances (namely on windows machines running Chrome). This bug, when it happened, caused the document capture step not to work.


## [0.8.3]

### Added
- Started tracking fatal exceptions and page views of the SDK.


## [0.8.2]

## Fixed
- Fixed bug of a broken layout on the document selection step. Always reproducible on IE and on other browsers too, but only when going back a step on certain conditions.
- Fixed bug where on IE an unnecessary scrollbar appeared and the scrolling area was bigger than it should have been.

### Added
- Public: An error message is now shown if the upload file has as unsupported file type.


## [0.8.1]

## Fixed
- `Object.assign` was being used but not polyfilled. Its occurrence was replaced with an es6 object construction.
- UI disappeared if the browser's windows width was smaller than 481px;


## [0.8.0]

### Changed
- Public: Captures are now returned as `png` instead of `webp`, although `webp` is still used internally for streaming to the server.
- Public: the captures returned by `Onfido.getCaptures()` have a simplified signature of just `{id,image,documentType}`.
- Public: It's now possible to open and close the modal by calling `.setOptions({isModalOpen:boolean})`
- Internal: The modal has been refactored to be fully reactive, `vanilla-modal` has been replaced with a fork of `react-modal`.
- Internal: Updated to `onfido-sdk-core@0.6.0`, selectors are now more general as in they are no longer specific to each capture type, some new selectors are also being used.
- Internal: `Camera`, `Capture` and `Uploader` have been refactored, the pure part of the components have been separated from the state logic part. This adds flexibility and encapsulation.
- Internal: The `Capture` component now orchestrates all the state logic of the `Uploader` component, this allows to join the camera and uploader state logic together.

### Added
- Public: The capture screen UI now includes an upload button fallback, for whenever the user experiences problems with the webcam.
- Internal: When requesting to validate documents there is now a strategy to cope with slow responses from the server. If the number of unprocessed documents is 3+, the client stops sending more requests until a response is given.
- Internal: `webp` falls back to `jpeg` in case the browser does not support it.


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


[next-version]: https://github.com/onfido/onfido-sdk-ui/compare/1.1.0...development
[1.1.0]: https://github.com/onfido/onfido-sdk-ui/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/onfido/onfido-sdk-ui/compare/0.15.1...1.0.0
[0.15.1]: https://github.com/onfido/onfido-sdk-ui/compare/0.15.0...0.15.1
[0.15.0]: https://github.com/onfido/onfido-sdk-ui/compare/0.14.0...0.15.0
[0.14.0]: https://github.com/onfido/onfido-sdk-ui/compare/0.13.0...0.14.0
[0.13.0]: https://github.com/onfido/onfido-sdk-ui/compare/0.12.0-rc.1...0.13.0
[0.12.0-rc.1]: https://github.com/onfido/onfido-sdk-ui/compare/0.11.1...0.12.0-rc.1
[0.11.1]: https://github.com/onfido/onfido-sdk-ui/compare/0.11.0...0.11.1
[0.11.0]: https://github.com/onfido/onfido-sdk-ui/compare/0.10.0...0.11.0
[0.10.0]: https://github.com/onfido/onfido-sdk-ui/compare/0.9.0...0.10.0
[0.9.0]: https://github.com/onfido/onfido-sdk-ui/compare/0.8.4...0.9.0
[0.8.4]: https://github.com/onfido/onfido-sdk-ui/compare/0.8.3...0.8.4
[0.8.3]: https://github.com/onfido/onfido-sdk-ui/compare/0.8.2...0.8.3
[0.8.2]: https://github.com/onfido/onfido-sdk-ui/compare/0.8.1...0.8.2
[0.8.1]: https://github.com/onfido/onfido-sdk-ui/compare/0.8.0...0.8.1
[0.8.0]: https://github.com/onfido/onfido-sdk-ui/compare/0.7.0...0.8.0
[0.7.0]: https://github.com/onfido/onfido-sdk-ui/compare/0.6.1...0.7.0
[0.6.1]: https://github.com/onfido/onfido-sdk-ui/compare/0.5.1...0.6.1
[0.5.1]: https://github.com/onfido/onfido-sdk-ui/compare/0.5.0...0.5.1
[0.5.0]: https://github.com/onfido/onfido-sdk-ui/compare/0.4.0...0.5.0
