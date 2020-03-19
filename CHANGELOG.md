# Changelog
All notable changes to this project will be documented in this file.

This change log file is based on best practices from [Keep a Changelog](http://keepachangelog.com/).
This project adheres to [Semantic Versioning](http://semver.org/). Breaking changes result in a different MAJOR version. UI changes that might break customizations on top of the SDK will be treated as breaking changes too.
This project adheres to the Node [default version scheme](https://docs.npmjs.com/misc/semver).

## [next-version]

### Fixed
- Public: Fix moderate vulnerabilities in `minimist`, a sub-dependecy used by `@babel/cli` and `@babel/register`.

## [5.8.0] - 2020-03-19

### Added
- Public: Changes to allow hybrid desktop/mobile devices  with environment facing cameras (e.g. Surface Pro) to use the `useLiveDocumentCapture` feature (BETA feature)
- Public: Added a `userAnalyticsEvent` to existing analytics calls for integrators to listen for.
- Internal: Analytics can now be disabled via the `disableAnalytics` option
- Internal: Test coverage for snapshot feature
- Internal: Send additional properties to back-end in `sdkMetadata` object
  - `isCrossDeviceFlow` (true|false)
  - `deviceType` (mobile|desktop)
  - `captureMethod` (live|html5)

### Changed
- Internal: Use `v2/snapshots` endpoint to upload additional selfie frames.
- Internal: Split Confirm component into multiple files.
- UI: Accessibility - Update font colours and weight following DAC Audit report feedback
- Internal: Pushing `dist` files to S3 and publishing the release to NPM has been automated using GitHub Actions
- Internal: Improve UI tests stability when looking for and clicking on UI elements
- Public: Documentation should use `v3` for API endpoints and include links to migration guide.

### Fixed
- Public: Fixed bug where iPads on iOS13 were detected as desktop devices.
- Public: Made fallback error message appropriate for both face and document verification
- Public: Fixed video recording in liveness capture step not working for Firefox >= 71
- Internal: Fix flaky modal UI tests
- Public: Fixed bug where blob was not handled correctly when an upload event was fired on IE11
- Public: Fixed camera permission screen layout issue on desktop Safari where buttons disappears below view height
- Public: Prevent "submit" event from being emitted when selecting a document

## [5.7.1] - 2020-02-25

### Fixed
- Public: Cross-device client and link now works when desktop SDK configured with US JWT

## [5.7.0] - 2020-01-22

### Added
- Public: Added a troubleshooting section to the documentation with details about solving CSP related issues
- UI: Added selfie intro screen
- UI: Option to send cross device secure link using QR code (**Note:** *changes introduced with this UI update include possible breaking changes for integrators with custom translations or copy*)

### Changed
- UI: Unsupported browser message for mobile browsers without getUserMedia API support when `uploadFallback` option is disabled for live document capture and selfie/liveness capture steps
- Internal: Redux and EventEmitter are not in the global scope anymore. The `tearDown` function will only unmount the SDK.
- UI: As part of work to add the QR code option for cross device secure link the UX has been updated for the copy link and SMS options

### Fixed
- Internal: Fixed Latest Surge link version not getting updated during release process
- UI: Fixed Liveness capture staying darkened after x-device message dismissed
- Accessibility: Changed Liveness background colour from 66% to 80%

## [5.6.0] - 2019-12-09
**Note:** This version might be a breaking change if you are providing customised language translations. Please see [MIGRATION](https://github.com/onfido/onfido-sdk-ui/blob/master/MIGRATION.md).

### Added
- Internal: Added UI test to check Submit Verification button is not clickable multiple times if Complete step is excluded
- Internal: Deploy source maps to Sentry using @sentry/cli within our deployment script

### Changed
- Internal: Updated `react-webcam-onfido` to get check(s) for stream before calling getVideoTracks/getAudioTracks method
- Internal: Removed `libphonenumber-js` from main bundle. Reduced bundle size limit by 20%.
- Internal: Use `@sentry/browser` instead of `raven` to track Sentry events
- UI: New Document Upload screen (**Note:** *changes introduced with this UI update include possible breaking changes for integrators with custom translations or copy*)

### Fixed
- Internal: Latest Surge link gets updated only on release of a full version, not release candidates or beta releases
- UI: Fixed missing "basic camera mode" link style on "Camera not working" timeout error message when going through flow on mobile
- UI: Fixed Back button not taking user to the right place during liveness recording
- UI: Fixed invalid but possible number error blocking subsequent retries
- UI: Users should not be able to click or tap on confirmation buttons or camera buttons multiple times. This will prevent callbacks (such as the onComplete callback) or click events to be fired multiple times.

## [5.5.0] - 2019-10-31

### Added
- Public: `useLiveDocumentCapture` option added to the document capture step (BETA feature)
- Internal: Added `bundlesize` script to fail the build if our bundle becomes bigger than 400kb. It also tests that cross-device chunk does not exceeds 3kb.
- Internal: Added `npm audit` script to the build using `audit-ci` to detect dependencies vulnerabilities at PR level.

### Fixed
- UI: Accessibility - Non-interactive Header elements do not get announced with "Double tap to activate" by Android Talkback
- UI: Custom string `nextButton` set for the `welcome` step is now displayed
- Internal: Fixed flaky UI tests by adding functions that wait until the elements are located or clickable

## [5.4.0] - 2019-10-03

### Added
- UI: Added hover and active state styles for clickable UI elements (buttons, links)
- Public: Added `onError` callback. Callback that fires when one of the following errors occurs: timeout errors, authorization errors, server errors and invalid and expired token errors.

### Changed
- Public: Disable console warning for client integrations that override only some strings for a supported language. If they provide partial translations for an unsupported language, warning is still displayed.
- Public: Only upgrade to patch versions of `socket.io-client`. See issue [here](https://github.com/socketio/socket.io-client/issues/1325)

### Fixed
- UI: Accessibility - Make camera feed view accessible to screen readers
- UI: Accessibility - More descriptive ARIA label for camera shutter button
- Public: Fixed user being able to submit verification multiple times on coming back to desktop from the cross device flow if integrator has opted to exclude the `complete` step in SDK setup
- Public: Fix wrong cross device redirection when user is already on mobile (iOS 10)

## [5.3.0] - 2019-09-03

### Added
- UI: User can now drag and drop images on desktop uploader
- Public: option to configure click on overlay behaviour when SDK presented modally using `shouldCloseOnOverlayClick` option
- Internal: Added basic automated tests for accessibility features
- UI: Accessibility - Make Liveness screens accessible to screen readers
- UI: Accessibility - Make Cross Device phone number input accessible to screen readers
- Internal: Added automated testing for features using camera stream
- Public: Added `useMultipleSelfieCapture` option for the `face` step. By enabling this configuration, the SDK will attempt to take multiple applicant selfie snapshots to help improve face similarity check accuracy.
- Internal: Fetch URLs from JWT when present, otherwise use defaults

### Changed
- Public: Unbundled dependencies for npm. This also fixes the current issue with imports (tested on Next.js, Create-react-app and Storybook) and solves [#615](https://github.com/onfido/onfido-sdk-ui/issues/615), [#668](https://github.com/onfido/onfido-sdk-ui/issues/668), [#733](https://github.com/onfido/onfido-sdk-ui/issues/733)
- UI: Changed camera permission screen design
- Internal: Disable source maps for NPM build. Source maps will still be enabled for `/dist` build
- Internal: Upgraded Preact for compatibility with latest version of React DevTools

### Fixed
- Public: Fixed user seeing the video capture intro screen, followed by selfie capture screen instead of x-device intro screen when video capture is enabled but device has no camera
- Public: Fixed wrong message displaying on the Cross Device "End of Flow" screen
- Public: Fixed footer overlapping Proof of Address document type list at the bottom of the container
- Public: Fixed user seeing front side of previously uploaded 2-sided document in Proof of Address upload step

## [5.2.3] - 2019-07-18

### Fixed
- Public: Removed tarball as a way to import wpt library. The package is now imported as a dev-dependecy and is pointing at the new Woopra repository on github.

## [5.2.2] - 2019-06-19

### Added
- Internal: Better automation of the release process
- UI: Accessibility - Make screenreader navigation work in modal mode

### Changed
- Public: Use tarball when importing wpt library

### Fixed
- Public: Fixed bug where double clicking on Send Link button then skips straight to Complete screen
- Public: Fixed scrollbar appearing on some machines/devices

## [5.2.1] - 2019-05-30

### Added
- UI: Accessibility - Announce validation error on cross device SMS link screen

### Changed
- UI: Accessibility - Update all visually obvious lists to use the relevant HTML list elements

### Fixed
- Public: When glare is detected, onComplete callback returns doc id

## [5.1.0] - 2019-05-23

### Added
- UI: Accessibility - Make H1 readable by screen readers
- UI: Accessibility - Make buttons/links readable by screen readers, allow tabbing to them
- UI: Accessibility - Sort out order of items when tabbing through the content of each step
- UI: Accessibility - Announce page transition when screen changes
- UI: Accessibility - Make capture previews readable by screen readers
- UI: Accessibility - Announce enlargement of captured image in preview
- UI: Accessibility - Announce camera alerts
- UI: Accessibility - Announce validation errors and warnings on confirm screen

### Changed
- Internal: Make Permission screen and Recovery screen buttons visible on small devices
- Internal: The third party analytics (Woopra) is now imported via a dummy window in order not to pollute the shared global window

### Fixed
- Public: Handle non JSON error responses and return a `Connection Lost` error to the user
- UI: Make sure "full screen" mode is off when navigating away from enlarged preview
- UI: Make sure all buttons have a type of a "button" set
- Internal: Fixed vulnerabilities on some dev dependencies

## [5.0.0] - 2019-04-01

### Fixed
- Public: Fixed issue where the user is prompted to submit the same document capture twice and fixed broken custom input UI by adding higher CSS specificity
- Internal: We are using an updated version of socket.io server, which allows for better horizontal scalling.

### Changed
- Public: If the SDK is initialised with only one document type, users will not see the document selection screen, instead they will see the capture screen straight away.
- Internal: Woopra is no longer polluting the global window object

## [4.0.0] - 2019-03-18

### Added
- Public: Prepopulate the user's mobile phone number, when specified through the `userDetails.smsNumber` option
- Public: Send through details (such as `id`s) of the uploaded files, in the `onComplete` event
- Public: Added `forceCrossDevice` option to `document` step. The feature forces users to use their mobile to capture the document image. It defaults to `false`. Not available on the Proof of Address flow.
- Public: Upload fallback for the `face` step can be disabled by using the option `{ uploadFallback: false }`. The default value is `true` (feature released in `3.1.0` as Internal)
- Internal: Add an internal-only warning for internal-users of the cross-device flow (a warning entirely stripped in production)

### Changed
- Public: ES style import interface has been changed to a more standard one
- Internal: Changed the way that blob/base64 files and images are rendered and passed through the system
- Internal: Changed CSS units to be consistently `em` (but still tied to `px` at our root, until we can fix our media queries)
- Public: More meaningful error message for upload fallback disabled on face step
- Internal: Map colours and use less variables instead of hard-coding colour values
- UI: Fixed issue with footer overlapping content, prevent buttons from disappearing below viewport, prevent images from overlapping buttons.
- Internal: Rebranding of background, border and primary colors.
- Internal: Woopra tracker now points at the latest tag of https://github.com/Woopra/js-client-tracker
- Internal: Upgraded to webpack 4, removed import/export transpilation. Reduced bundle size as result.

### Fixed
- Public: Users entering the cross-device flow twice would have been able to request an SMS message without re-entering their mobile number correctly (the form could submit when still blank)
- Internal: Fix a bug that potentially allowed 3rd party tracking scripts to (in some very specific conditions) continue to send Onfido tracking events, after calling `.tearDown()`
- Public: Users could previously see a flicker of other screens when loading any flow involving the camera. This should now no longer occur, except in rare circumstances (where permissions/capabilities have changed since last render)
- Public: Workaround an iOS Safari issue that causes a possible browser crash when mounting the webcam component multiple times

## [3.1.0] - 2019-01-28

### Added
- Public: Added Proof of address `poa` step where users can capture their proof of address documents. This is a beta feature.
- Internal: Further device metadata submitted to Onfido API
- Internal: Upload fallback for the `face` step can be disabled by using the option `{ uploadFallback: false }`. The default value is `true`
- Internal: Added multi-frame capture for the `standard` variant of the face step (only for camera capture).

### Changed
- Internal: Cross device client can now only be opened on mobile browsers. Users trying to open the link on a desktop browsers will see an error.
- Internal: Removed unused development dependencies which had known vulnerabilities

## [3.0.1] - 2018-12-19

### Fixed
- Internal: Fixed an infinite loading loop that happened when video liveness is enabled and if, and only if, users transitioned from a desktop browser that support video liveness to a mobile browser that does not support video liveness

## [3.0.0] - 2018-10-31

### Added
- Internal: Introduce Jest unit testing framework
- Public: Added support for default SMS number country code. The default country for the SMS number input can be customised by passing the `smsNumberCountryCode` option when the SDK is initialised. The value should be a 2-characters long ISO Country code string. If empty, the SMS number country code will default to `GB`.
- UI: UI improvements including adding back icon with hover state and icon to close the modal

### Changed
- Public: Remove support for `buttonId` initialization option
- Internal: Use imports-loader instead of script-loader to import Woopra
- Internal: Ensures only onfido related events are included as part of the payloads sent to Sentry
- Internal: Stop sentry tracking after tearDown
- Internal: Prevent Raven from using console.log output for breadcrumbs by setting autoBreadcrumbs: { console: false }

## [2.8.0] - 2018-09-20

### Changed
- UI: Documents can be enlarged for inspection
- UI: Camera warnings are now dismissible
- UI: Title copy change on video confirmation screen

### Fixed
- Public: Fixed error with missing stream recording
- UI: Fixed document selector UI on IE11
- UI: Fixed overlapping footer and buttons on confirmation screen on Firefox

## [2.7.0] - 2018-09-03

### Added
- Public: Introduced ability to capture videos on the face step. Developers can now request a preferred variant for the face step, by adding the option `requestedVariant: 'standard' | 'video'`. If empty, it will default to `standard` and a photo will be captured. If the `requestedVariant` is `video`, we will try to fulfil this request depending on camera availability and device/browser support. In case a video cannot be taken the face step will fallback to the `standard` option. At the end of the flow, the `onComplete` callback will return the `variant` used to capture face and this can be used to initiate the facial_similarity check.

### Changed
- Public: The `onComplete` callback now returns an object including the `variant` used for the capture step. The variant can be used to initiate the facial_similarity check. Data returned: `{face: {variant: 'standard' | 'video'}}`.
- UI: Selfie UI to adopt full container layout on desktop.
- Internal: CSS namespacing now includes the full path of the component, to mitigate chances of name collision. Only impacts components nested in another component folder.

## [2.6.0] - 2018-08-08

### Changed
- Internal: Changed assets url to point at https://assets.onfido.com/

## [2.5.0] - 2018-07-27

### Added
- UI: Added a permission priming screen to inform the user that camera permissions must be enabled.
- UI: Added a permission recovering screen in case user media permissions are denied.
- UI: Added intro screen when entering cross device flow.

### Changed
- UI: Changed UI for face capture step. On small screens it will display a full screen camera component.
- UI: Desktop - If webcam is not available, a cross device intro screen will be shown to allow the user to take a live photo on their mobile phones.

## [2.4.1] - 2018-05-18

### Fixed
- Public: Fixed bug where hitting Enter key on the SMS input number was causing page reload.

## [2.4.0] - 2018-05-17

### Added
- Public: Added `documentTypes` to the `document` step options, which allows to filter the document types.

### Changed
- Internal: Refactored layout to better handle presence of header and footer elements.
- Internal: On cross device client clear error message when configuration is received.

## [2.3.0] - 2018-04-17

### Added
- Public: Added `onModalRequestClose` options, which is a callback that fires when the user attempts to close the modal.

### Fixed
- Public: Fixed `complete` step to allow string customization at initialization time.
- Internal: Fixed the `tearDown` method to clear the onComplete callback functions. (issue [#306](https://github.com/onfido/onfido-sdk-ui/issues/306))

### Deprecated
- Internal: Removed references to `useWebcam` option from README.md and return console warning if the option is used.

## [2.2.0] - 2018-02-13

### Added
- Public: Added support for internationalisation. The SDK can now be displayed in Spanish by adding `{language: 'es'}` to the initialization options. It can also be displayed in a custom language by passing an object containing the custom phrases and the locale. If `language` is not present or the wrong locale tag is provided, the language locale will default to `en`.
- Public: Added support for Spanish language on the SMS body.
- Public: Added webcam support on Safari and IE Edge.

### Changed
- UI: If the webcam is facing the user it will be mirrored

## [2.1.0] - 2017-11-30

### Added
- UI: The cross device feature now supports sending the link via SMS. Users will still be able to copy the link to clipboard.
- UI: Introduced a back button that allows the user  to navigate to the previous screen.
- Internal: Introduced code splitting and lazy loading

## [2.0.0] - 2017-11-08

In this version, we're introducting cross-device flow that allows to continue verification on mobile in order to take photos of your document and face.

**Note:**
- This version is not backwards-compatible. Migration notes can be found in [MIGRATION.md](MIGRATION.md)

### Removed

- Public: Removed `onDocumentCapture` that used to be fired when the document had been successfully captured, confirmed by the user and uploaded to the Onfido API
- Public: Removed `onFaceCapture` callbacks that used to be fired when the face has beed successfully captured, confirmed by the user and uploaded to the Onfido API.
- Public: Removed `getCaptures` function that used to return the document and face files captured during the flow.
- Internal: Removed confirm action

### Changed
- Public: Changed the behaviour of `onComplete` callback. It used to return an object that contained all captures, now it doesn't return any data.

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

[next-version]:
https://github.com/onfido/onfido-sdk-ui/compare/5.8.0...development
[5.8.0]: https://github.com/onfido/onfido-sdk-ui/compare/5.7.1...5.8.0
[5.7.1]: https://github.com/onfido/onfido-sdk-ui/compare/5.7.0...5.7.1
[5.7.0]: https://github.com/onfido/onfido-sdk-ui/compare/5.6.0...5.7.0
[5.6.0]: https://github.com/onfido/onfido-sdk-ui/compare/5.5.0...5.6.0
[5.5.0]: https://github.com/onfido/onfido-sdk-ui/compare/5.4.0...5.5.0
[5.4.0]: https://github.com/onfido/onfido-sdk-ui/compare/5.3.0...5.4.0
[5.3.0]: https://github.com/onfido/onfido-sdk-ui/compare/5.2.3...5.3.0
[5.2.3]: https://github.com/onfido/onfido-sdk-ui/compare/5.2.2...5.2.3
[5.2.2]: https://github.com/onfido/onfido-sdk-ui/compare/5.2.1...5.2.2
[5.2.1]: https://github.com/onfido/onfido-sdk-ui/compare/5.1.0...5.2.1
[5.1.0]: https://github.com/onfido/onfido-sdk-ui/compare/5.0.0...5.1.0
[5.0.0]: https://github.com/onfido/onfido-sdk-ui/compare/4.0.0...5.0.0
[4.0.0]: https://github.com/onfido/onfido-sdk-ui/compare/3.1.0...4.0.0
[3.1.0]: https://github.com/onfido/onfido-sdk-ui/compare/3.0.1...3.1.0
[3.0.1]: https://github.com/onfido/onfido-sdk-ui/compare/3.0.0...3.0.1
[3.0.0]: https://github.com/onfido/onfido-sdk-ui/compare/2.8.0...3.0.0
[2.8.0]: https://github.com/onfido/onfido-sdk-ui/compare/2.7.0...2.8.0
[2.7.0]: https://github.com/onfido/onfido-sdk-ui/compare/2.6.0...2.7.0
[2.6.0]: https://github.com/onfido/onfido-sdk-ui/compare/2.5.0...2.6.0
[2.5.0]: https://github.com/onfido/onfido-sdk-ui/compare/2.4.1...2.5.0
[2.4.1]: https://github.com/onfido/onfido-sdk-ui/compare/2.4.0...2.4.1
[2.4.0]: https://github.com/onfido/onfido-sdk-ui/compare/2.3.0...2.4.0
[2.3.0]: https://github.com/onfido/onfido-sdk-ui/compare/2.2.0...2.3.0
[2.2.0]: https://github.com/onfido/onfido-sdk-ui/compare/2.1.0...2.2.0
[2.1.0]: https://github.com/onfido/onfido-sdk-ui/compare/2.0.0...2.1.0
[2.0.0]: https://github.com/onfido/onfido-sdk-ui/compare/1.1.0...2.0.0
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
