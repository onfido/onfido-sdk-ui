# Changelog

All notable changes to this project will be documented in this file.

This change log file is based on best practices from [Keep a Changelog](http://keepachangelog.com/).
This project adheres to [Semantic Versioning](http://semver.org/). Breaking changes result in a different MAJOR version. UI changes that might break customizations on top of the SDK will be treated as breaking changes too.
This project adheres to the Node [default version scheme](https://docs.npmjs.com/misc/semver).

## [next-version]

### Added

- Public: Added npm latest version badge.
- Internal: Now the UI tests will hit API endpoints from a dockerised mock server.
- Internal: Introduce integration tests for API endpoint integrations.
- Internal: Introduce TypeScript on non-critical components & deprecate FlowType.
- Internal: App component, Redux system, utils, HoCs & routers are now typed in TypeScript.
- Internal: Refactor for better reusability of video capture components.
- Public: Improvements in video capture steps.

### Changed

- Internal: Switched to `bundlewatch` Github Action for bundle size diff reporting, checking.
- UI: Updated text and background colours.
- Public: Removed references to MIT license in README and updated copy in LICENSE to refer to Onfido Service Agreement and 3rd party licenses reports.
- Public: Return error for image quality failures on the first two document upload attempts.

### Fixed

- Public: Fix "File type not supported" error on snapshot upload in selfie step.
- Public: Fix typo in `en_US.json` file

## [6.4.0] - 2020-12-21

### Added

- Internal: Introduce Hooks on non-critical components.
- Public: Added `CROSS_DEVICE_INTRO`, `CROSS_DEVICE_GET_LINK` user analytic events for integrators to listen for when tracking user journey when initiating Cross Device flow from desktop browser
- Public: Added `licenses.json` file containing the list of dependencies licenses.

### Changed

- UI: User is no longer blocked from uploading an image file over 10MB in size. Instead image is resized to 1440px if file size is over 3MB.
- Internal: Update SDK's Publish Release workflow to not use the now deprecated `set-env` command.

### Fixed

- Public: Fixed issue where the SDK could not be initialised with `poa` as a single step.
- Public: Only return `Missing keys` warning for unsupported language locale tags

## [6.3.1] - 2020-11-30

### Fixed

- Public: Fix missing country selector screen when the SDK is imported as an NPM module.

## [6.3.0] - 2020-11-09

### Added

- Internal: Added unit tests for Demo and App components
- Public: Updated supported documents data to include Peru, Colombia as an issuing country option in Country Selection screen when user selects Residence Permit document type and remove Saudi Arabia option for National Identity Card document type.
- Public: Added `CROSS_DEVICE_START` to Tracked events list
- Public: Country Selection screen can now be suppressed for a non-passport document type when configured with a 3-letter ISO code.

### Changed

- Internal: Upgrade Preact from version `8.5.2` to `10.5.4`.
- Internal: Replace `react-modal-onfido` with version `3.11.2` of `react-modal`.
- Internal: Refactor cross device option logic.

### Fixed

- Public: Fixed Woopra module import errors
- Internal: Include isCrossDevice property and value in Document, Face capture payload's sdk_metadata object for data tracking

## [6.2.1] - 2020-11-04

### Fixed

- Public: Non-Latin localised strings throw exception in Welcome screen.

## [6.2.0] - 2020-10-19

### Changed

- UI: Accessibility - Update passport quality guide copy to be more descriptive for visually impaired users using screen readers
- Internal: Update the Web SDK to handle `telephony` back end service's new error response format which is now consistent with API's error response format
- Public: Improve description of `showCountrySelection` option for Document step to be more explicit about when/how it works and include example configurations.
- Internal: Store third-party licence comments for each bundle in separate files.
- Internal: Re-enable skipped tests for image quality logic.

### Fixed

- UI: Accessibility - Loading screen is now announced on iOS
- Internal: Release script didn't update `BASE_32_VERSION` correctly and didn't finish at publishing tag step

## [6.1.0] - 2020-10-16

### Added

- Public: Add `migrate_locales` script to enable integrator migrate to next versions of Web SDK locale system.
- Internal: Add `unwrap_lokalise` script to sanitise locale files pulled from Lokalise.

### Changed

- Public: Introduced new system for locale keys. Keys are now more structured and easier to find within the code.
- Internal: Replace all string values from `JS SDK` to `Web SDK` and `js-sdk` to `web-sdk`.

### Fixed

- UI: Accessibility - Error and warning alert heading is now ARIA heading level 1
- UI: Camera inactivity timeout only starts from camera access granted instead of on initial render
- UI: Fixed call to action buttons covering content and instructions on Passport Image Guide, Selfie Intro screens when viewed on a mobile device with a shorter viewport, e.g. iPhone SE (1st gen)

## [6.0.1] - 2020-10-09

### Fixed

- Public: Updated supported documents data. This update includes adding Turkey as an issuing country option in Country Selection screen when user selects National Identity Card type.
- Public: Only send `issuing_country` to the documents endpoint if `issuing_country` is present. This fixes the issue that was preventing documents upload when `showCountrySelection` was disabled and `issuing_country` was `undefined`.

## [6.0.0] - 2020-09-17

### Added

- UI: Add country selection screen after document selection. This screen is skipped by default for a preselected document but can still be displayed by enabling the `showCountrySelection` option for the `document` step.
- UI: New warnings for cut-off & blurry images detection.
- UI: When the uploaded image is either cut-off, glary or blurry, the end-user must retry at most 2 times prior to proceeding further.
- UI: Added Residence Permit option for document selection
- Internal: The release script and the `release/RELEASE_GUIDELINE.md` file now include the information needed to update the `MIGRATION.md` file.
- Internal: Send additional `system` data in `sdk_metadata` which contains `os`, `os_version`, `browser` & `browser_version` info of the current session.

### Changed

- Internal: Changed resolution constraints for live document captures from `720` to `1080`.
- Public: Remove `SMS_BODY` key from locale files as it's not a customisable key and does not belong to this codebase.
- Internal: Update SDK to handle new error response format from cross device SMS service

### Fixed

- Public: Return a generic error for unmapped Onfido API validation keys.
- Fix typo in PhoneNumberInput SASS styles producing invalid CSS
- UI: Fixed inconsistent font family for non Primary, Secondary button elements.

## [5.13.0] - 2020-08-24

### Added

- Public: Added `isCrossDevice` flag to user analytics events to differentiate between cross-device and non-cross-device user analytic events
- Public: Added `DOCUMENT_TYPE_SELECT` and `FACIAL_CAPTURE` to user analytics event list
- Public: Added option to pass a container element `containerEl` instead of a container ID string `containerId`. If `containerEl` is provided, then `containerId` will be ignored.

### Changed

- Internal: Sass CSS pre-processor is now used instead of Less.
- Public: Fix live camera issues on certain Android devices, such as Huawei P20, when the `useLiveDocumentCapture` option for documents is enabled.
- Internal: Fix cross-device SMS number input bundle import that broke when using newer versions of `@babel/preset-env`.
- Internal: Added Prettier code formatting on `npm run lint`
- Internal: Hybrid devices are now detected by checking if the device has touch screen and is Windows, instead of calling `getUserMedia`.
- Internal: Use Onfido API v3 endpoints for `documents`, `live_photos`, `live_videos` and `snapshots`.
- Public: When `uploadFallback` option is disabled for document or face live captures, display the unsupported browser error at the beginning of the flow.

### Fixed

- Public: Fixed spelling mistakes in Spanish translations for `cross_device.link.sms_option` and `cross_device.link.qr_code_sub_title`

## [5.12.0] - 2020-07-08

### Added

- Public: Added new enterprise feature `cobrand`. This allows integrators with access to the feature to display a co-branded footer with their company name, followed by "powered by Onfido" on all screens, including cross-device. Note that this will not be displayed if the `hideOnfidoLogo` enterprise feature is also enabled.
- Internal: Added bundle size limit check for `dist/style.css`.
- Public: Fix empty file sometimes being sent to /snapshots endpoint on some browsers when `useMultipleSelfieCapture` is enabled. This results in user seeing a "Unsupported File" error on Selfie upload.

### Changed

- Public: Moved `UserAnalytics` event firing outside of `disableAnalytics` config check

### Fixed

- UI: Top and bottom of icon cut off on Camera Permission screen for Document Auto Capture

## [5.11.1] - 2020-07-01

### Fixed

- Public: Fix issue preventing the SDK from loading or being updated in runtime if a step with type `document` is not found.

## [5.11.0] - 2020-06-30

### Added

- Public: Added check for cross_device_url in SDK Token to be used as the link for all cross device options instead of the default HOSTED_SDK_URL, if present. cross_device_url is an enterprise feature and can only be set when creating a SDK token if the feature is enabled.
- Public: Added new enterprise feature `hideOnfidoLogo`. When purchased and enabled allows integrator to hide the Onfido logo on all screens, including cross-device.
- UI: Added passport quality guide before upload/capture.

### Changed

- Public: Use `history/createBrowserHistory` as the default option to manage the SDK history. This change also gives the integrators the option to use `history/createMemoryHistory` by passing the configuration option `useMemoryHistory: true` to the SDK, in case `history/createBrowserHistory` does not behave as expected.
- UI: Updated to new Onfido SDK watermark design

### Fixed

- Public: Fix issue that affects Safari on iOS 13.4.1, where the SDK was showing the wrong image rotation.
- Public: Fix false `Missing keys` warning for present mobilePhrases. The warning should only be displayed when translation keys are missing.
- Internal: Fix failing IE11 UI test for Passport upload

## [5.10.0] - 2020-06-16

### Added

- Internal: Added basic history to SDK demo.
- Public: Added French translation. The language tag is `fr_FR`.

### Changed

- Internal: Remove unused dependencies and scripts from `package.json`
- Public: Update description for `region` queryString in `CONTRIBUTING.md`
- Public: Updated Browser Compatibility section in `README.md` to better indicate IE11, Firefox support
- Public: Update English copy text for error message shown when no document is in the cameras view
- Public: The `useMultipleSelfieCapture` configuration option is now stable and enabled by default
- UI: All primary/secondary buttons now use the new width styling. This change also fixes the buttons UI issues noticeable when using `de_DE` as a language.

### Fixed

- UI: Accessibility - Focus is at document start
- Public: Fix unexpected back button behaviour due to `createBrowserHistory` usage. The SDK now uses `createMemoryHistory`.
- UI: Fixed blank screen displaying instead of Cross Device screen on desktop browsers when `uploadFallback` is disabled and browser does not have getUserMedia API support, e.g. IE11, or device does not have a camera.

## [5.9.2] - 2020-05-19

### Fixed

- UI: Fixed 2000ms delay to load Document Capture screen on non-Safari browsers

## [5.9.1] - 2020-05-14

### Fixed

- UI: Camera not detected on Safari 13.1 on iOS 13.4.1, macOS 10.15.4

## [5.9.0] - 2020-04-28

### Added

- Public: Added German translation and Lokalise integration. The expected language tags are now `en_US`, `es_ES`, `de_DE`. For backward compatibility, the SDK can also be initialised with tags that do not include the region, e.g.`en`, `es`, `de`.
- Public: Added information on api/token regions to documentation.
- Internal: Added `CA` region in demo app. The region can be selected in the previewer or by using a query string.

### Changed

- Public: Updated to `react-webcam-onfido@0.1.18` to have fix for camera stream not getting on some Android devices, e.g. Motorola G5, Samsung Galaxy A6

### Fixed

- Public: Fix moderate vulnerabilities in `minimist`, a sub-dependecy used by `@babel/cli` and `@babel/register`.
- Public: Fixed hybrid device camera detection and access request
- Public: Fixed bug where user is able to click/tap on the button on the Camera screen before allowing/denying permission.
- Public: Fixed iPads on iOS13 not getting detected as mobile device on cross device flow.

## [5.8.0] - 2020-03-19

### Added

- Public: Changes to allow hybrid desktop/mobile devices with environment facing cameras (e.g. Surface Pro) to use the `useLiveDocumentCapture` feature (BETA feature)
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
- UI: Option to send cross device secure link using QR code (**Note:** _changes introduced with this UI update include possible breaking changes for integrators with custom translations or copy_)

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
- UI: New Document Upload screen (**Note:** _changes introduced with this UI update include possible breaking changes for integrators with custom translations or copy_)

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
- UI: Introduced a back button that allows the user to navigate to the previous screen.
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

[next-version]: https://github.com/onfido/onfido-sdk-ui/compare/6.4.0...development
[6.4.0]: https://github.com/onfido/onfido-sdk-ui/compare/6.3.1...6.4.0
[6.3.1]: https://github.com/onfido/onfido-sdk-ui/compare/6.3.0...6.3.1
[6.3.0]: https://github.com/onfido/onfido-sdk-ui/compare/6.2.1...6.3.0
[6.2.1]: https://github.com/onfido/onfido-sdk-ui/compare/6.2.0...6.2.1
[6.2.0]: https://github.com/onfido/onfido-sdk-ui/compare/6.1.0...6.2.0
[6.1.0]: https://github.com/onfido/onfido-sdk-ui/compare/6.0.1...6.1.0
[6.0.1]: https://github.com/onfido/onfido-sdk-ui/compare/6.0.0...6.0.1
[6.0.0]: https://github.com/onfido/onfido-sdk-ui/compare/5.13.0...6.0.0
[5.13.0]: https://github.com/onfido/onfido-sdk-ui/compare/5.12.0...5.13.0
[5.12.0]: https://github.com/onfido/onfido-sdk-ui/compare/5.11.1...5.12.0
[5.11.1]: https://github.com/onfido/onfido-sdk-ui/compare/5.11.0...5.11.1
[5.11.0]: https://github.com/onfido/onfido-sdk-ui/compare/5.10.0...5.11.0
[5.10.0]: https://github.com/onfido/onfido-sdk-ui/compare/5.9.2...5.10.0
[5.9.2]: https://github.com/onfido/onfido-sdk-ui/compare/5.9.1...5.9.2
[5.9.1]: https://github.com/onfido/onfido-sdk-ui/compare/5.9.0...5.9.1
[5.9.0]: https://github.com/onfido/onfido-sdk-ui/compare/5.8.0...5.9.0
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
