# CHANGELOG
This changelog documents all notable modifications made to the Web SDK over time. The purpose of this record is to provide transparency and traceability surrounding the evolution of the SDK.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and the SDK adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

When any of the string translations change, it will result in a MINOR version change. As a result, you are responsible for ensuring the correct layout if you are using custom translations (see [language localization](https://documentation.onfido.com/sdk/web/#custom-translations-and-text)).

## 14.57.0 - 2025-11-19
### Changed
- Fix back button on crossdevice (desktop)
- Resolved incorrect iframe positioning
- display keyboard on mobile when clicking on country selector chevron

## 14.56.0 - 2025-11-03
### Changed
- Set `resizeMode` to `none` in video constraints to prevent browser-side video rescaling

## 14.55.0 - 2025-10-16
### Changed
- General improvements

## 14.54.0 - 2025-09-29
### Changed
- Removed the preInit permission check that triggers a permission popup at the start of the permission flow in webviews

### Fixed
- Refetch feature flags on crossdevice
- Fixed loading containers size to take full containers size

## 14.53.1 - 2025-08-26
### Fixed
- Check webassembly support for opencv use
- Prevent errors when localstorage is not available

## 14.53.0 - 2025-08-18
### Added
- Added Waiting screen events
  
### Changed
- Upload fallback and hasCamera check to be triggered from WithCameraPermission

### Fixed
- Fixed origin during passkey authentication

## 14.52.0 - 2025-08-06
### Fixed
- Update type for passkey.get
- Fixed CSP issue with Enroll Passkey & Authenticate Passkey modules

## 14.51.0 - 2025-07-21
### Added
- Allow dynamic QR code timeout to be configured remotely
- Separate theme/config/customFont option for client-specific fonts

### Fixed
- Fixed UI tokens for Alerts and Banners.

## 14.50.0 - 2025-07-01
### Added
- Enable filtering POA types for all countries

### Changed
- QR code refresh interval has been changed to 20s

### Removed
- Removed face option `useMultipleSelfieCapture` and set the default to `true`

### Fixed
- Fixed Motion intro animation loading flash on dark themes

## 14.49.0 - 2025-06-20
### Added
- Added ability to show an exit button, `showExitButton` API, with its complementary callback, `onUserExit`"
- Added onExternalLink callback

### Fixed
- Correct the navigation bar styling on capture screens

## 14.48.0 - 2025-06-12
### Added
- Introduce disableCompleteScreen for studio flows

## 14.47.1 - 2025-06-12
### Changed
- Changed Store on-device biometrics task input to take an encrypted biometric token
- Removed background of video on the motion intro screen

## 14.47.0 - 2025-06-11
### Changed
- The preInit camera permission check for webview is now behind feature flag.

### Fixed
- Flickering of background color and border when screens were loading. Particularly noticeable when loading cross device screen.
- Regression where border customization was not possible, also border started expanding outwards causing overflow.
- Regression where PoA did not show an error for pdf files with more than 20 pages.

## 14.46.1 - 2025-05-22
### Changed
- The `preInit` camera permission check for webview is now behind feature flag.

## 14.46.0 - 2025-05-19
### Added
- Added new fullscreen option for external links to support AES on mobile

### Changed
- Studio Welcome screen updated and template image media container dimension now has a height of 208px
- Added support for AES on mobile capture

### Fixed
- Reintroduced tertiary button style overrides for clients
- Removed the `too short` message from the One-Time-Password (OTP) code screen
- Fix overexposed photo issue in iOS 18.4

## 14.45.2 - 2025-05-08
- Correction for npm bundle and version pinning

## 14.45.0 - 2025-04-09
### Changed
- Document Upload page is updated. see [migration guide](https://documentation.onfido.com/sdk/web/migration)

## 14.44.0 - 2025-03-26
### Added
- Ability to refresh the cross-device QR code every 10 seconds
- Added new screen templates, meaning all module screens have been updated with new design templates. For specific details, please refer to the [Web SDK template guide](https://documentation.onfido.com/sdk/web-sdk-ui-templates), and the [migration guide](https://documentation.onfido.com/sdk/web/migration)
- Ability to show a custom logo on the cross-device verification screen on mobile
- Added 'Authentication: motion' task support

### Changed
- A number of the Web SDK styling attributes have also been updated or removed with this release. Please refer to the [migration guide](https://documentation.onfido.com/sdk/web/migration/) for specific details.

### Deprecated
- Deprecated public API parameter disableAnalyticsCookies (replaced by a feature flag)

### Fixed
- Fixed Motion connection error screen visibility issue
- Fixed incorrect Motion instruction message during face capture

## 14.43.0 - 2025-02-19
### Fixed
- Corrected public documentation relating to the Document and Proof of Address payloads in `onComplete` manual callbacks

## 14.42.0 - 2025-02-06
### Added
- Added a warning when a Studio SDK token is used with a manual definition of the verification steps

### Changed
- Changed QES module icons, list markers, consent indicators to respect theme colors
- Changed checkboxes to reflect custom theme

### Fixed
- Reset cross-device verification on disconnect
- Background color for loading screen now supported

## 14.41.0 - 2025-01-16
### Added
- Added a warning when a Studio SDK token is used with a manual definition of the verification steps

### Fixed
- Profile Data now correctly accepts 8 to 10 digit-long Kenyan ID card numbers
- Corrected public documentation relating to the Document and Proof of Address (poa) payloads in `onComplete` manual callbacks

## 14.40.0 - 2024-12-11
### Fixed
- Do not show the consent screen if consent was already granted

## 14.39.2 - 2024-11-25
No changes

## 14.39.1 - 2024-11-20
No changes

## 14.38.1 - 2024-11-19
No changes

## 14.39.0 - 2024-11-18
### Added
- Added support for local storage for the 'Face capture: motion' task
- Added support for the 'Show introduction screen' option in the 'Face capture: motion' task configuration
- Added warning to push usage of Studio token over SDK token and deprecation message
- Added new accessible autocomplete component

### Changed
- Disabled smart caret for OTP phone input

### Removed
- Removed debug log from production build

### Fixed
- Fixed type exports
- Provided a more descriptive cross-device error screen
- Fixed shifting cursor issue during One-Time-Password phone number input

## 14.38.0 - 2024-10-01
### Removed
- Removed the 10s timeout for the loading of modules

### Fixed
- Prevented QR code from showing during re-connection phase
- Fixed navigation bug related to consent in Classic mode
- Implemented `cross_device_url` for enterprise clients

## 14.37.1 - 2024-09-19
### Fixed
- Fixed a bug for Mobile SDKs

## 14.37.0 - 2024-09-18
### Added
- Added documentation for the new `theme` API

## 14.36.0 - 2024-09-11
### Added
- Motion intro screen can be skipped through `showIntro` option

### Removed
- Removed Motion confirmation screen

## 14.35.1 - 2024-09-09
### Fixed
- TypeScript support for the npm package

## 14.35.0 - 2024-09-03
### Added
- Replaced basic camera with Javascript camera for the Proof of Address (poa) module

### Fixed
- Ensured the Motion instruction video is dismissed on the head-turn side complete
- Accessibility screen reader and keyboard navigations
- Assistive technologies now read instructions in center of capture frame

## 14.34.0 - 2024-08-15
### Added
- Added preselect country in documents list following the value of custom input `preferred_user_country` (previously only worked with Studio)

### Changed
- Updated CSP - Added data: to `media-src`
- Fixed accessibility and usability issues with the document list
- Optional task completion task when using Studio token

### Removed
- Removed inactivity error message and continue to display shutter button

### Fixed
- Extended SSN scope to include US territories: American Samoa, Guam, Northern Marian Islands, United States Virgin Islands and Puerto Rico
- Changed the Redo button displayed after an error when uploading a document to a primary button

## 14.33.0 - 2024-07-31
### Fixed
- Ensured screen readers don't read headings twice
- Resolved an issue causing infinite loading when pressing the back button on the video preview screen

## 14.32.0 - 2024-07-24
### Changed
- Added 'data:' to media-src in the Content Security Policy

### Fixed
- Fixed video preview on iOS
- Replaced the `faceVideo` intro icons with bullet points aligned with Motion
- Improved accessibility of the country selector label
- Fixed modal accessibility

## 14.31.0 - 2024-07-17
### Fixed
- Check audio permission for `faceMotion` when `recordAudio` is enabled
- Fixed `UPLOAD` user analytics event
- Removed whitespaces at end of string inputs for Profile Data

## 14.30.0 - 2024-07-04
### Fixed
- Fixed `UPLOAD` user analytics event
- Removed whitespaces at end of string inputs for Profile Data

## 14.29.0 - 2024-06-25
### Fixed
- Various bug fixes and accessibility updates

## 14.28.0 - 2024-06-20
### Fixed
- Various bug fixes and accessibility updates

## 14.27.1 - 2024-06-05
### Added
- Added an error warning if no international code is included in the phone number field for one-time password link
- International code is now included in the phone number field for one-time password link

## 14.27.0 - 2024-05-30
### Changed
- Exposed version in the `Onfido.init` handle

## 14.26.0 - 2024-05-23
### Changed
- Adjustment to the preloading of modules to reduce loading time
- Added new SDK error types for `workflow_abandoned` and `workflow_error`

## 14.25.0 - 2024-05-13
### Changed
- Motion is now supported on all devices

### Removed
- Removed `motionFallbackVariant` option

## 14.24.0 - 2024-04-25
### Changed
- Updated CSP guide for troubleshooting most common issues

## 14.23.1 - 2024-04-19
No changes

## 14.23.0 - 2024-04-10
### Added
- New Document or SSN selection module / Task

## 14.22.0 - 2024-03-28
### Fixed
- Improved cross-device verification adjustments
- Fixed document type configurations
- Fixed typing for npm loader

## 14.21.0 - 2024-03-20
### Fixed
- Fixed TypeScript types missing `SdkParameters`

## 14.20.1 - 2024-03-12
No changes

## 14.20.0 - 2024-03-12
### Changed
- Support `crossDevicePolicy: "force"` for Face modules

## 14.19.0 - 2024-03-05
### Fixed
- Fixed an issue where Firefox is used on desktop and redirects the user as part of the `onComplete` callback
- Fixed accessibility issues

## 14.18.0 - 2024-03-01
### Added
- New Google Fonts supported

### Changed
- CSP updates

## 13.8.4 - 2024-02-27
No changes

## 14.17.0 - 2024-02-23
### Changed
- Added `SameSite=None` for `onfido-web-sdk-analytics` cookie to allow cookie to be transferred once browsers switches to new default of `SameSite=Lax`
- Added promise to `tearDown()`
- Improved analytics properties

## 13.8.3 - 2024-02-21
No changes

## 14.15.0 - 2024-02-01
### Changed
- Please refere to our [migration guide](https://documentation.onfido.com/sdk/web/migration/) for a complete list of changes

## 13.8.2 - 2024-01-23
No changes

## 13.8.1 - 2024-01-17
### Removed
- Removed check for audio permission in webview

## 13.8.0 - 2024-01-02
### Removed
- Removed `migrate_locales` scripts
- Removed performance benchmark

### Fixed
- Fixed validation for Indonesia ID number
- Fixed National ID Number semantic type and display

## 14.16.0 - 2023-12-19
### Fixed
- Perform retries on 5xx error

## 13.7.0 - 2023-11-08
### Added
- Added `permissions_unavailable` error type to the `onError` callback

### Changed
- Update camera icon for Document upload

### Fixed
- Disable Picture-in-Picture tooltip during Face capture

## 13.6.1 - 2023-10-24
### Fixed
- Fixed disabled submit button in country selection in Proof of Address (poa) step

## 13.6.0 - 2023-10-24
### Changed
- Document capture: Add integrator events `DOCUMENT_CAPTURE_FRONT` and `DOCUMENT_CAPTURE_BACK` for the Javascript camera
- Document country selection: Automatically close the keyboard after country is selected
- Added support a selection of Google Fonts

## 13.5.1 - 2023-10-12
### Fixed
- Fixed duplicated back button on Motion loading screen

## 13.5.0 - 2023-10-06
### Changed
- Add new `showIntro` configuration for the Standard and Video capture steps
- New permission screen instructions were added to guide users on various devices/browsers to recover from denied access to the camera

### Fixed
- A click on the search icon in the Country Selector will focus the input field
- JS Document capture is now fixed for Firefox on Android
- Show spinner while we're waiting for the next Studio task to be ready

## 13.4.0 - 2023-09-27
### Added
- Added new `colorBackgroundDropdownItemHover` and `colorBackgroundDropdownItemActive` UI customization option for the country selector.
- Added ODP error handling (https://documentation.onfido.com/#original-document-present-reasons)
- New document capture experience change: Stop rendering the fallback message after two blurry document upload tries.

### Changed
- Three changes in the Javascript "New document capture experience": One, increase timeout to see the fallback error message from 40s to 80s. Two, don't show the fallback error message when `uploadFallback` is disabled. Three, keep the button available even when the `uploadFallback` error message is shown.
- Support `customUI` on self-hosted cross-device instances

### Fixed
- Prevented Windows Touch machines from using the Javascript camera. In some cases, the Windows Touch machines were allowed to behave as mobile devices. This is no longer the case
- Fixed the resolution of the new Document Capture experience (Javascript Camera) for iOS devices. It was 1443px instead of 1440px.

## 13.3.2 - 2023-09-18
### Fixed
- Fixed workflow double document steps and blank screen after face capture

## 13.3.1 - 2023-08-22
### Changed
- Prevented Windows Touch machines from using the Javascript camera. In some cases, the Windows Touch machines were allowed to behave as mobile devices. This is no longer the case

## 13.3.0 - 2023-08-16
### Added
- Added a general tips section in the README.md

### Changed
- Changed the welcome screen wording to comply with video recording regulations
- Fixed loading modules when the first module is skippable (in Studio)

## 13.2.0 - 2023-08-08
### Fixed
- Custom cross-device URLs can now contain a path between the host and the hash. Ex: `https://host:port/some/path/HASH`
- Color contrast in button and remove icons preload

## 13.1.0 - 2023-07-20
### Added
- Added Accessibility translations for Motion
- Added support for Romanian national identity number in Profile Capture

### Changed
- Updated `resend SMS` copy for better user experience

### Fixed
- Fixed `issuing_country` on `cross-device` for `passport` not added to payload

## 12.4.1 - 2023-07-14
### Fixed
- Fixed close button on document preview

## 13.0.1 - 2023-07-11
### Added
- Added play / pause button to motion intro animation video

### Fixed
- Fixed duplicate Motion capture uploads on SDK initialisations without a `complete` step
- Fixed Motion capture recording starting too early

## 13.0.0 - 2023-07-11
### Added
- Added a new error when barcode detection issues arise

### Removed
- Removed `uploadFallback` option in the `document` step
- Removed `uploadFallback` option in the `face` step

### Fixed
- Fixed workflow multi document tasks step configuration

## 12.4.0 - 2023-06-19
### Changed
- Added an instructional video in the Face Video intro screen
- Expose Motion events as [user analytics](https://github.com/onfido/onfido-sdk-ui#tracked-events)

### Fixed
- Fixed custom colours on icons
- Fixed phone input to prevent country from resetting
- Fixed `InvalidStateException` in edge cases where webcams takes too long to initialise
- Fixed icon sizes on intro screens with long texts

## 12.3.6 - 2023-06-16
### Changed
- Deprecate the `tearDown` method. Prefer `safeTearDown`, which is a promise and awaitable.

## 12.3.5 - 2023-06-09
### Fixed
- Public: Fix a crash in the Selfie step when the SDK is bundled

## 12.3.4 - 2023-06-08
### Fixed
- Public: Bump react-webcam to 7.1.1. Really fixes the bug that caused selfies to appear stretched on Safari 15.
- Public: Fix preact version to 10.11.3. This should improve our stability when our library is rebundled (NPM).

## 12.3.3 - 2023-06-01
### Fixed
- Internal: Fix internal issue.

## 12.3.2 - 2023-05-30
### Fixed
- Public: Fix a bug that prevented document upload from the native camera application.
- Public: Fix a bug that caused selfies to appear stretched on Safari 15.

## 12.3.1 - 2023-05-25
### Changed
- Public: Document selection: fix a bug where the documents were wrongly selected when the welcome screen was not in use and the documents were filtered with the Dashboard.
- Public: Fix a bug that happens only in some cases, where Document Capture was not working because of a library import issue (preact/compat).

## 12.3.0 - 2023-05-24
### Changed
- Public: Updated document capture documentation
- Public: Add `disableWelcomeScreen` option to disable the welcome screen for Studio workflows.
- Public: Remove Auth SDK
- Internal: Enhanced security around payload tampering
- Public: Add capture of ID numbers for Vietnam
- Internal: Auto uppercase postcode to avoid errors

## 10.4.0 - 2023-01-23
### Changed
- Public: Fixed a bug in the selfie/face video step, where the face would not be zoomed in correctly.
- Public: Reduce by one the number of forced retries in case of error while submitting a document. For a max retry count of 4, the 5th attempt will be the final one (previously it was the 6th attempt).
- Public: In the document step, if there is only a single country due to `documentTypes` option, show a disabled input with the country pre selected for the user.
- Public: In the document step, add new option `hideCountrySelection` to bypass the country selection sub screen. Refer to the README for more information.
- Public: Added support for dashboard document selection via `/supported_documents` endpoint and `enableDocumentSupportRules` option for overriding dashboard feature flag.

## 10.3.1 - 2023-01-13
### Changed
- Fix for consistent language between desktop and mobile in cross device flow

## 10.3.0 - 2023-01-11
### Changed
- Internal: Added `isWebView` SDK configuration option for enabling native featured via webview
- Public: Prevent error during tearDown when fired from onComplete callback
- Public: Workflow configurable `forceCrossDevice` to `document` and `poa` task. The features lets Studio users

## 10.2.0 - 2022-12-15
### Changed
- Public: Add a range of new languages
- Public: Add RTL support
- Public: Use browser language when available

## 10.1.0 - 2022-12-08
### Changed
- Public: For Romanian National ID back side, stop having errors displayed (new IDs have nothing on the backside)
- Public: Fix a Cross Device issue: `When the face step comes before the document step, it's asked for the type of document and issuing country on the desktop then again on the mobile`
- Public: Add Document auto capture for the New Document Capture Experience. It will be progressively rolled out at Onfido's discretion, depending on Document Type and Document Country
- Public: Add the New Document Capture Experience. It will be progressively rolled out at Onfido's discretion, to replace the native camera application
- Public: Deprecate beta option `useLiveDocumentCapture`. The option was not working properly, it will be removed during next quarterly
- Public: Deprecate undocumented alpha option `useWebcam`. The option was not working, at all, it will be removed during next quarterly
- Public: Added support for cs_CZ, ro_RO and pl_PL locales
- Internal: Add Performance analytics
- Internal: Track screen transition with performance analytics
- Internal: Add network and feature flag support for Logger
- Internal: Add data-onfido-qas for a few elements on profile screen and country option selection
- Public: GA workflow api 3.5 integration
- Public: Add new `colorBackgroundSelector` UI customization option
- Public: Add new `colorBackgroundDocTypeButtonHover` and `colorBackgroundDocTypeButtonActive` UI customization options

## 10.0.2 - 2022-11-29
### Changed
- Public: Fix for https://github.com/onfido/onfido-sdk-ui/issues/2127
- Public: Fix for https://github.com/onfido/onfido-sdk-ui/issues/2131

## 10.0.1 - 2022-11-24
### Fixed
- Public: Validation for the "date of birth" field (profile capture screen)

## 10.0.0 - 2022-11-21
### Changed
- Public: Revert the `useLiveDocumentCapture` changes
- Public: Add UI customization options for buttons hover & active states
- Public: Add UI customization options for giving small icons a custom color
- Public: Add UI customization option for input `outline-color`
- Public: Accept `motion` as a `requestedVariant` for the `face` step
- Public: Document Content Security Policy changes related to Motion
- Internal: Move `sdkConfiguration` in to store
- Internal: Add feature flag for inhouse analytics
- Internal: Add `x-onfido-sdk-metadata` header to all onfido network requests
- Internal: Add integration & intergration-version to `x-onfido-sdk-metadata` header
- Internal: Add `PageVisibility`
- Internal: Add a performance benchmark
- Public: Display the correct error screen when expired trial
- Public: Added translations for expired trial `errors.expired_trial.instruction` and `errors.expired_trial.message`
- Internal: Add network and feature flag support for Logger

## 9.1.4 - 2022-10-26
### Changed
- Public: Add Honduras and Mexico National Identity Cards
- Public: Change the `useLiveDocumentCapture` option: camera selection logic improved, resolution increased to 1920x1080

## 9.1.3 - 2022-10-18
### Added
- Public: Display the correct error screen when expired trial
- Public: Added translations for expired trial `errors.expired_trial.instruction` and `errors.expired_trial.message`

## 9.1.2 - 2022-10-10
### Changed
- Public: Welcome page UI changes for trial accounts

## 9.1.1 - 2022-09-26
### Changed
- Fix setting "pan" value for the profile capture step

## 9.1.0 - 2022-09-23
### Changed
- Internal: Migrated onfido/react-webcam fork to typescript and absorbed it into this repo
- Internal: Add utility tool for locales
- Internal: Add Logger module
- Internal: Remove woopra
- Internal: Migrate analytics from `/v3` to `/v4`
- Internal: Place cross device SMS feature behind a feature flag
- Internal: Add `disableAnalyticsCookies` option
- Internal: Integrate Passive Signals module

## 9.0.0 - 2022-09-05
### Changed
- Internal: Migrated onfido/react-webcam fork to typescript and absorbed it into this repo
- Internal: Collect `FACE_LIVENESS_*` analytics events
- Internal: Send OS name and version information in sdk configuration request
- Internal: Update terser to 5.14.2 & moment to 2.29.4
- Internal: Add Network module
- Internal: Move all network calls to the Network module
- Internal: Add `trackPropertiesBeforeMount` to internal analytics api
- Public: Add commit hash in console
- Internal: Add `x-onfido-sdk-version` and `x-onfido-sdk-platform` headers to all onfido network requests
- Internal: Update FaceTec SDK on Auth step from 9.4.11 to 9.4.12
- Internal: Show connection error screen on active video upload errors

## 8.3.0 - 2022-08-02
### Changed
- Public: Fixed setoption, setOptions was setting unspecified values to their default value.
- Internal: Add dynamically loaded files (except en_US)
- Internal: Upgraded Sentry to v7, added ErrorBoundary, fingerprinting and moved into its own module
- Internal: Move Woopra into it's own core module
- Internal: Migrate webpack to typescript
- Internal: Add cross device pooling
- Public: Support for SSN (for USA only) data capture.
- Public: Collect country of residence before other profile data
- Public: Add translations for profile data
- Public: Support DocumentTypes option
- Public: Remove asterisk from required fields
- Public: Merge country and document selection in a single screen.
- Internal: Remove isFullScreen prop from NavigationBar
- Internal: Add missing analytics events from DocumentLiveCapture and DocumentMultiframe

## 8.1.0 - 2022-06-13
### Changed
- Internal: Migrate the react-webcam code into SDK + migrate it to typescript
- Internal: Use the `max_total_retries` field from SdkConfiguration to compute the max number of document capture retries after an image quality failed check. It was previously was set to 1.
- Internal: Add `video_instruction_type` property to analytics event `FACE_VIDEO_CAPTURE` and `FACE_VIDEO_CAPTURE_NEXT_BUTTON_CLICKED`
- Internal: Rename analytics event `FACE_VIDEO_CAPTURE_RECORDING_NEXT_CLICKED` to `FACE_VIDEO_CAPTURE_NEXT_BUTTON_CLICKED`
- Internal: Add `ui_alerts` properties to `FALLBACK_TRIGGERED` analytics events
- Internal: Add many new analytics events `CAMERA_ACCESS_*`, `CAPTURE_*`, `CONFIRMATION_*`
- Internal: Add new analytics events `NAVIGATION_BACK_BUTTON_CLICKED` and `NAVIGATION_CLOSE_BUTTON_CLICKED`
- Internal: Rename analytics event `FACE_INTRO` to `FACE_SELFIE_INTRO`
- Internal: Add properties to analytics events for `DOCUMENT_CAPTURE` & `DOCUMENT_CONFIRMATION`
- Internal: Remove `trackComponentMode()` & `trackComponentAndMode()`
- Internal: Added test case configs to our demo app with queryString `testCase`
- Internal: Add a css root scope to our SDK
- Public: Scope our customization of castor components to our SDK css root
- Public: Strip away `color-scheme` to prevent interference with customer styles
- Internal: Upgrade `@sentry/browser@6.19.7`
- Internal: Fix Sentry artifacts CI upload
- Internal: Migrated `MobileFlow` & `CrossDeviceSubmit` to typescript
- Internal: Migrated `MobileFlow`, `CrossDeviceLink` & `CrossDeviceSubmit` to typescript
- Internal: Added `ScreenLayout` to CrossDeviceSubmit
- Internal: Update FaceTec SDK on Auth step from 9.4.5 to 9.4.11
- Internal: Upgrade `typescript` to 4.6.2
- Public: Add UI customization option for `colorBackgroundQRCode`

### Fixed
- Public: Fix inline style to support Content Security Policy
- Public: Fix for http 204 request errors due to parsing
- Public: Fix for skipping step when using cross-device on mobile
- Public: Fix for showing user consent multiple times
- Public: Fix error when `mobilePhrases` is supplied but `phrases` are not

## 6.15.6 - 2022-06-08
### Fixed
- Public: Added mapping to convert old to new analytics events

## 6.20.1 - 2022-04-28
### Fixed
- Public: Fix useLiveDocumentCapture onComplete not working (cross device capture `variant` missing)

## 8.0.0 - 2022-04-21
### Changed
- Public: Removed `userConsent` step option. User Consent is controlled by Onfido API.
- Internal: Set `acceptSslCerts` to `true` for browserstack CI test to avoid "This connection is not private" screens
- Internal: Migrate `ModalApp` to typescript
- Internal: Add support for `.env` file
- Public: Update Proof of Address flow to present Country Select
- Public: Determine Proof of Address document options from endpoint

### Fixed
- Public: Fix useLiveDocumentCapture onComplete not working (cross device capture `variant` missing)

## 6.20.0 - 2022-04-12
### Changed
- Internal: Upgraded to webpack 5
- Internal: Upgraded `eslint`, `mocha`, `jest`
- Internal: Resolved all deprecated & vulnerability issues by removing and upgrading packages
- Internal: Added more pollyfills for IE11
- Internal: Upgraded `react-webcam-onfido` to `1.0.0`
- Internal: Removed `dist` & `lib` from repo and added to `.gitignore` file
- Public: Removed `*.LICENSE.txt` files from `lib` & `dist`, see `licenses.json` instead
- Public: Fixed `CrossDeviceInfo` screen layout to prevent scrolling
- Public: Merged `dist/onfido.vendors~crossDevice.min.js` into `dist/onfido.crossDevice.min.js`
- Public: Merged `dist/onfidoAuth.6.min.js` to `onfidoAuth.min.js`
- Public: Rearranged `dependencies` & `devDependencies` in `package.json` to reflect correct usage
- Internal: `CrossDeviceMobileRouter` always connects to desktop to gather the config
- Public: Added a cookie with anonymous uuid for analytics purposes
- Internal: Upgrade `minimist` to `v1.2.6` to fix vulnerability
- Public: Added a "microphone & camera" permission screen
- Internal: Handle errors by callback instead of `throw` for `requestChallenges` and `postToBackend`
- Internal: Migrated `ClientSuccess` to typescript
- Internal: Added individual analytics `*_upload_started` & `*_upload_completed` events for all uploads
- Internal: Fixed behavior for analytics event `CUSTOM_API_REQUEST_COMPLETED` & added `CUSTOM_API_REQUEST_COMPLETED`
- Internal: Updated `integratorTrackedEvents` with multiple triggers for `UPLOAD` to reflect analytics upload events changes
- Internal: Upgrade `minimist` to v1.2.6
- Internal: Upgrade `node-fetch@2.6.7` & `node-forge@1.3.1`

### Fixed
- Internal: Set ideal photo width for selfie step to ensure consistency across mobile devices
- Internal: Prevent Face step (variant: video) from falling back to selfie upon camera error when `uploadFallback: false` is provided
- Internal: Remove duplicated config and strip out custom locales from analytics events
- Public: Fix issue where `poa` and `document` steps cannot be used at the same time. Adds `poa` key to `onComplete` callback.
- Public: Fix mis-aligned text for IE11 on Welcome screen
- Internal: Fix polyglot to hide missing locales and add warning when in development

## 6.19.0 - 2022-03-14
### Changed
- Internal: Refactor selfie capture step to ensure camera is ready before enabling any capture
- Internal: Update `multipleSelfieCapture` feature to ensure snapshot is taken at a different time than the selfie
- Internal: Migrate `SdkConfiguration` to `v3.3`

### Fixed
- Public: Add compatibility with Salesforce
- Public: Add type `DocumentTypes` to `DocumentResponse`
- Internal: Migrated `NavigationBar` to typescript
- Internal: Migrated `Pannable` to typescript
- Internal: Migrated `QRCode` to typescript
- Internal: Migrated `PhoneNumberInput` to typescript
- Internal: Migrated `locales/polyglot` to typescript

## 6.18.0 - 2022-02-28
### Added
- Public: Updated supported documents list to include Curaçao and other countries.
- Public: Updated document capture experience for better image quality (multi-frame capture)

### Changed
- Internal: Added `SdkConfigurationServiceProvider` and `useSdkConfigurationService` to retrieve and use feature flags.
- Vastly decreased bundle size by not publishing "webpack visualizer" files to NPM.
- Internal: Added new analytics events for confirmation errors
- Internal: Added new analytics events for camera, upload, http requests and sms errors
- Internal: Update FaceTec SDK on Auth step from `9.3.4` to `9.4.5`. Removed 3 hardcoded custom properties defined on Auth component UI.
- Internal: Added events for video preview and face video recording/next buttons
- Internal: Added new analytics events for custom callbacks
- Internal: Prevent analytics events without mapping from being send to our api
- Public: Update documentation for custom callbacks

### Fixed
- UI: Fixed Stick Hover State for buttons on iOS Safari
- Public: Fix locale key mismatch for the title of the `CAMERA_NOT_WORKING_NO_FALLBACK` error
- Internal: Upgrade `eventemitter2` to v2.2.2
- Public: Fix usage of `removeAllListeners` in `ModalApp`
- Public: Fixed CSS variables naming for internal tokens

## 6.17.0 - 2022-01-24
### Changed
- Change the behavior when `useMultipleSelfieCapture` feature is enable to stop capturing periodic snapshots once the final selfie is being captured.

### Fixed
- UI: Fixed Live Document Capture flow's camera inactive warning not displaying the basic camera fallback option if `uploadFallback` is not defined for SDK configuration's Document step.

## 6.16.0 - 2021-12-15
### Added
- Public: Added support for Dutch `nl_NL`.
- Internal: Added new analytics event naming convention for `v3/analytics`. Woopra will still receive the old events until we are ready to discontinue the integration.

### Changed
- Public: Added `autoFocusOnInitialScreenTitle` SDK configuration option for integrators to override the SDK auto focusing on the initial screen's title on loading. The default behaviour may not be desirable for some host apps or sites as it could cause the browser to focus on the SDK, rather than content or form inputs outside of the SDK that the end user should see and fill in first.
- Upgrade `react-phone-number-input` to v3.1.38
- Revert change which returns document type as 'unknown' in `onComplete` callback payload if Residence Permit is selected. The API now supports Residence Permit as a document type for document uploads.

## 6.15.5 - 2021-12-02
### Fixed
- UI: Set the 'Send link' Button component on Cross Device Send SMS Link screen as `type="button"` to prevent the Button component defaulting to a `submit` type button when SDK is embedded within a `form` element.
- UI: Fix live document capture overlay appearing very small compared to how it was in version `6.14.0`.

## 6.15.4 - 2021-11-25
### Fixed
- Public: Fix issue where multiple SDK instances were sharing the same Redux store values. This was resulting in duplicate cross-device links across multiple instances. With this change, the redux store is reset every time one SDK instance is unmounted via the `tearDown()` function.

## 6.15.3 - 2021-11-10
### Fixed
- UI: Fix layout issues for Microsoft Surface tablets on some integrations, i.e. Country Selector text input height, camera stream view offset too far to the left in portrait orientation.
- Update all Sass / division operation to use the new math.div() syntax to address Sass 2.0 deprecation warnings.
- Upgrade react-webcam-onfido to 0.1.27 to enforce default values for video/audio bitrate to ensure generated file size is not bigger than necessary.

## 6.15.2 - 2021-11-01
### Changed
- UI: Host country flag icons internally and fix flag icons not being displayed on Cross Device SMS Phone Number Input, 2-sided documents' Country Selector screens.

### Fixed
- Public: Use new version of `react-webcam-onfido` that includes fix to correctly apply the `muted` attribute to the `video` element. This will prevent the "Live Broadcast" screen to appear on some Safari iOS versions, which is the cause of the identical snapshot and live photos issue.

## 6.15.1 - 2021-10-21
### Fixed
- Public: Fix error when face step selfie/video variant was requested for users on mobile devices
- UI: Set all Button components as `type="button"` if not already set as that to prevent the Button component defaulting to a `submit` type button.
- UI: Fix SDK only displaying a loading spinner instead of the "Something's gone wrong" error screen with messages "The link only works on mobile devices / You’ll need to restart your verification on your computer".
- Public: Fixed Web SDK breaking with a `Container wasn't rendered!` console error on the Document live capture step when in Modal mode since version `6.11.1`
- Public: Fix SDK displaying "The following keys have missing data: document_front" console error and not triggering the `onComplete` callback to integrator if user transitioned to Cross Device flow for the Face step
- UI: Fix UI issue where a user returning to the Desktop tab after completing the capture on cross-device flow, sees "Document" in the confirmation list even when a document was not captured.

## 6.15.0 - 2021-10-11
### Added
- Internal: Added configuration to support visual regression tests to run against multiple languages.
- Internal: Send analytics events to `v3/analytics`. Analytics events are also sent to Woopra, until we are ready to discontinue the current Woopra integration.

### Changed
- UI: Accessibility - Return focus to Document capture image preview's "Enlarge image" toggle button when expanded image preview's "Close" toggle button is clicked.

### Fixed
- Public: Video element errors and validation errors returned by live_videos endpoint are handled by the Web SDK
- Public: Fix grey oblong background appearing under the red cross icon on the Unsupported Browser error screen
- Public: Remove grey circle background from SVG icon displayed on Generic Error screen so that custom circle background is visible
- Internal: Upgraded some dev dependencies to fix some npm security vulnerabilities, also upgraded socket.io-client dependency to v4.2.0 to resolve npm security vulnerability in ws@7.4.4

## 6.14.0 - 2021-09-13
### Added
- UI: Added new Intro screen when user begins the Cross Device flow on their mobile device.
- Public: Added SDK configuration options for integrators to customize product name, copy and/or logo image for the new Cross Device Mobile Client Intro screen.

### Fixed
- Public: Fixed custom SDK body text color set in `customUI.colorContentBody` option not getting applied to Country Selector text input if an element level text colour has been set in host app/site's stylesheet.
- UI: Fixed Country Selector dropdown menu closing on clicking on scrollbar.
- Internal: Auth - Fetch correct API URL from the Redux store

## 6.13.0 - 2021-08-23
### Added
- Internal: New data field in metadata to track number of takes for each submitted image.

### Fixed
- UI: Fixed the text placement to be below the primary button in the Document Upload screen.
- Public: Fixed cross-device connection issue when cross-device link is accessed multiple times.
- UI: Fix QR Code link section rendering issue in Safari 14 on desktops
- UI: The Cross Device link options visible to end users can be configured by passing an array of the link method IDs (`qr_code`, `sms`, `copy_link`) in the order of preference to `_crossDeviceLinkMethods` in SDK initialization configuration.

## 6.12.0 - 2021-08-10
### Changed
- UI: Accessibility - Make "Tips" heading in Cross Device SMS Sent and Mobile Connected screens a level 3 heading.
- UI: Accessibility - Change Cross Device Send Link alternate option text to be an ARIA heading level 2

### Fixed
- UI: Fix camera view not lining up with Document Live Capture overlay and fix image distortion on some devices' live camera view by maintaining camera view aspect ratio.
- Public: Fix file selector "capture" prop for WebSDK inside iOS WebView
- Public: Fix `CROSS_DEVICE_START` user analytic event for integrators never being dispatched when user switches to the Cross Device flow
- UI: Update copy in Face Liveness Video intro screen from 25s to 20s to reflect the correct time limit
- Remove old locale key type definitions that are no longer used/exist in code base.

## 6.11.1 - 2021-07-20
### Added
- UI: Accessibility - Add ARIA role `img` and an ARIA label for the generated cross device secure link QR code image
- Internal: Resolved inaccurate reporting on test automation failures.
- Internal: Added note about lockfileVersion and npm version requirement for SDK contributors in CONTRIBUTING.md documentation.
- Public: Improvements in video capture steps.

### Changed
- UI: Accessibility - Add ARIA role `button` to "Resend link" and "Cancel" links on Cross Device flow SMS Sent, Mobile Connected screens.
- Internal: Remove `image_quality` breakdowns from `sdk_warnings` response because the field will be soon deprecated.
- Internal: Moved `geckodriver` from `dependencies` to `devDependencies`.
- Internal: Added ability to run tests without the use of the mock server for the UI tests.

## 6.10.2 - 2021-07-08
### Fixed
- UI: Fixed Camera Permissions Primer screen rendering issue on Safari 14.1 (desktop) without changing existing SDK layout structure.

## 6.10.1 - 2021-07-05
### Changed
- Reduce resolution to VGA if browser does not support recording videos in WebM format (e.g. Safari 14.x that only supports MP4 format) to avoid large video files being created.
- UI: Fixed Camera Permissions Primer screen rendering issue on Safari 14.1 (desktop) by using ScreenLayout wrapper component.

## 6.10.0 - 2021-06-22
### Added
- Internal: Added note about lockfileVersion and npm version requirement for SDK contributors in CONTRIBUTING.md documentation.
- Public: Added support for Italian `it_IT` and Portuguese `pt_PT`.
- Internal: Added support for visual regression testing using Percy.
- Internal: Resolved inaccurate reporting on test automation failures.
- Internal: Added ability to execute/ignore tests via the use of tags/regex.

### Changed
- UI: Update Face Liveness Video Challenge screen UI
- UI: Updated default Welcome screen UI
- Public: Move documentation for SDK UI Customizations and Premium Enterprise Features into separate Markdown files to reduce README size
- Public: Updated SDK copy for English (en_US), Spanish (es_ES), French (fr_FR) and German (de_DE). For details on what keys/copy have changed please refer to the MIGRATION.md documentation.
- Internal: Upgrade sass (Dart Sass) from `1.26.9` to `1.33.0`
- Internal: Upgrade stylelint from `13.6.1` to `13.13.1` as well as stylelint-config-sass-guidelines from `7.0.0` to `8.0.0` and stylelint-scss from `3.18.0` to `3.19.0`

### Fixed
- Internal: Upgrade Preact from version `10.5.4` to `10.5.13` in order to resolve an unhandled exception on reinitialising the SDK after closing the SDK modal for some integrations when using Modal mode.
- Public: Fix Country Selection screen not displaying when SDK is initialised with boolean `documentTypes` configuration.
- Public: Fixed issue where `onComplete` callback was fired without the necessary data for the `face` step. Added exception to `onError` callback to inform that `onComplete` could not be fired due to missing data.

## 6.9.0 - 2021-05-24
### Added
- Public: Added Authentication module as a beta feature
- Internal: Added support for testing across multiple browsers.
- Internal: Added polyfills for `Object.entries` and `Object.fromEntries` for IE11.

### Changed
- Update to module on `tsconfig.json` from `es6` to `esnext`, to allow conditional imports of specific modules (especially useful for Auth/IDV bundle separation).

### Fixed
- UI: Fix SVG icon on Cross Device Uploads Successful, Selfie Intro screens not displaying on some iOS devices, e.g. iPhone 12

## 6.8.0 - 2021-05-13
### Added
- Internal: Add type defition for `borderRadiusSurfaceModal` customisation option.
- Public: Add information about Lokalise CLI v2 in CONTRIBUTING doc
- Internal: Refactor `useSdkOptions()` hook to return a tuple: `[options, { findStep }]`
- Internal: Added default filename for all document uploads if filename is not present.
- Public: Added user consent content reload screen
- Public: When `photoCaptureFallback` option is disabled in the face step, the requested variant is video and browser does not support MediaRecorder, attempt to redirect to the cross-device flow or display the unsupported browser error.
- Internal: Refactor for better reusability of video capture components.

### Changed
- Internal: Migrate CI build from TravisCI to Github Actions
- Internal: Upgraded socket.io-client to v4.0.1 to resolve npm security vulnerability 1665 (high severity)

### Fixed
- Public: Get latest copy from Lokalise with various grammar, punctuation fixes. Also reverts French, Spanish translations for some Proof of Address copy in these languages' locale files (Proof of Address is only supported for English)

## 6.7.2 - 2021-04-26
### Fixed
- Public: Fix Cross Device "Send Link" options link affecting host app/site's page routing on click
- UI: Fixed flickering country list on SMS country dropdown. The fix involves updating `deviceHasCameraSupport` in the Redux store only when the value changes.
- Internal: Fix Liveness Video upload payload to `/live_videos` API endpoint missing `challenge_switch_at` property and value
- Internal: Fix incorrect format of `language_code` value in Liveness Video upload payload to `/live_videos` API endpoint

## 6.7.1 - 2021-03-26
### Fixed
- UI: Fix host app/site's own link styling getting overridden by SDK's default theme styling

## 6.7.0 - 2021-03-25
### Added
- Internal: Introduce `SdkOptionsProvider` component and `useSdkOptions()` hook for SDK options' single source of truth.
- Public: Added cross-device support for useCustomizedApiRequests callbacks via customer hosting of SDK. Note - This is a premium enterprise feature.
- Public: Added support for UI customizations in SDK configuration using `customUI` option. See README for details of supported customization options.
- Internal: Add Woopra tracking for UI customization option usage.

### Changed
- UI: Replaced internal button component with button from @onfido/castor-react.
- UI: Replaced some Sass variables with CSS variables to allow customization of colors and fonts.
- Public: Added new enterprise feature `logoCobrand`. When purchased and enabled allows integrator to provide their own logo image to be displayed alongside the Onfido logo.
- Internal: Use Node 14 LTS for Travis to be consistent with `.nvmrc` and `Dockerfile`.
- Internal: Enable `strict` mode in tsconfig.json

### Fixed
- UI: Fix Camera Permission icon not displaying on iOS devices on Selfie/Liveness capture flow

## 6.6.0 - 2021-03-09
### Added
- Internal: Added ScreenLayout component. This is currently used in the Welcome and Complete screens.
- Public: Added user consent screen
- Public: Added callbacks that are triggered on user media submission if the feature is enabled. Note - This is a premium enterprise feature.
- Internal: App component, Redux system, utils, HoCs & routers are now typed in TypeScript.
- Internal: Use ScreenLayout component in Confirm screen.

### Changed
- Internal: Replace `ts-loader` with `@babel/preset-typescript` for better TypeScript transpilation.

### Fixed
- Public: Fix zoomed document capture view for Document Live Capture on some Huawei devices, e.g. Huawei P40, P30.
- Public: Fix issue where documents are submitted to Onfido API without filename or file type.

## 6.5.0 - 2021-02-08
### Added
- Public: Added npm latest version badge.
- Internal: Now the UI tests will hit API endpoints from a dockerised mock server.
- Internal: Introduce TypeScript on non-critical components & deprecate FlowType.
- Internal: Introduce integration tests for API endpoint integrations.

### Changed
- Internal: Switched to `bundlewatch` Github Action for bundle size diff reporting, checking.
- UI: Updated text and background colours.
- Public: Removed references to MIT license in README and updated copy in LICENSE to refer to Onfido Service Agreement and 3rd party licenses reports.
- Public: Return error for image quality failures on the first two document upload attempts.

### Fixed
- Public: Fix "File type not supported" error on snapshot upload in selfie step.
- Public: Fix typo in `en_US.json` file

## 6.4.0 - 2020-12-21
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

## 6.3.1 - 2020-11-30
### Fixed
- Public: Fix missing country selector screen when the SDK is imported as an NPM module.

## 6.3.0 - 2020-11-09
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

## 6.2.1 - 2020-11-04
### Fixed
- Public: Non-Latin localised strings throw exception in Welcome screen.

## 6.2.0 - 2020-10-19
### Changed
- UI: Accessibility - Update passport quality guide copy to be more descriptive for visually impaired users using screen readers
- Internal: Update the Web SDK to handle `telephony` back end service's new error response format which is now consistent with API's error response format
- Public: Improve description of `showCountrySelection` option for Document step to be more explicit about when/how it works and include example configurations.
- Internal: Store third-party licence comments for each bundle in separate files.
- Internal: Re-enable skipped tests for image quality logic.

### Fixed
- UI: Accessibility - Loading screen is now announced on iOS
- Internal: Release script didn't update `BASE_32_VERSION` correctly and didn't finish at publishing tag step

## 6.1.0 - 2020-10-16
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

## 6.0.1 - 2020-10-09
### Fixed
- Public: Updated supported documents data. This update includes adding Turkey as an issuing country option in Country Selection screen when user selects National Identity Card type.
- Public: Only send `issuing_country` to the documents endpoint if `issuing_country` is present. This fixes the issue that was preventing documents upload when `showCountrySelection` was disabled and `issuing_country` was `undefined`.

## 6.0.0 - 2020-09-17
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

## 5.13.0 - 2020-08-24
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

## 5.12.0 - 2020-07-08
### Added
- Public: Added new enterprise feature `cobrand`. This allows integrators with access to the feature to display a co-branded footer with their company name, followed by "powered by Onfido" on all screens, including cross-device. Note that this will not be displayed if the `hideOnfidoLogo` enterprise feature is also enabled.
- Internal: Added bundle size limit check for `dist/style.css`.
- Public: Fix empty file sometimes being sent to /snapshots endpoint on some browsers when `useMultipleSelfieCapture` is enabled. This results in user seeing a "Unsupported File" error on Selfie upload.

### Changed
- Public: Moved `UserAnalytics` event firing outside of `disableAnalytics` config check

### Fixed
- UI: Top and bottom of icon cut off on Camera Permission screen for Document Auto Capture

## 5.11.1 - 2020-07-01
### Fixed
- Public: Fix issue preventing the SDK from loading or being updated in runtime if a step with type `document` is not found.

## 5.11.0 - 2020-06-30
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

## 5.10.0 - 2020-06-16
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

## 5.9.2 - 2020-05-19
### Fixed
- UI: Fixed 2000ms delay to load Document Capture screen on non-Safari browsers

## 5.9.1 - 2020-05-14
### Fixed
- UI: Camera not detected on Safari 13.1 on iOS 13.4.1, macOS 10.15.4

## 5.9.0 - 2020-04-28
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

## 5.8.0 - 2020-03-19
### Added
- Public: Changes to allow hybrid desktop/mobile devices with environment facing cameras (e.g. Surface Pro) to use the `useLiveDocumentCapture` feature (BETA feature)
- Public: Added a `userAnalyticsEvent` to existing analytics calls for integrators to listen for.
- Internal: Analytics can now be disabled via the `disableAnalytics` option
- Internal: Test coverage for snapshot feature
- Internal: Send additional properties to back-end in `sdkMetadata` object
  - `isCrossDeviceFlow` (true|false

## 5.7.1 - 2020-02-25
### Fixed
- Public: Cross-device client and link now works when desktop SDK configured with US JWT

## 5.7.0 - 2020-01-22
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

## 5.6.0 - 2019-12-09
- \*Note:\*\* This version might be a breaking change if you are providing customised language translations. Please see [MIGRATION](https://github.com/onfido/onfido-sdk-ui/blob/master/MIGRATION.md).

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

## 5.5.0 - 2019-10-31
### Added
- Public: `useLiveDocumentCapture` option added to the document capture step (BETA feature)
- Internal: Added `bundlesize` script to fail the build if our bundle becomes bigger than 400kb. It also tests that cross-device chunk does not exceeds 3kb.
- Internal: Added `npm audit` script to the build using `audit-ci` to detect dependencies vulnerabilities at PR level.

### Fixed
- UI: Accessibility - Non-interactive Header elements do not get announced with "Double tap to activate" by Android Talkback
- UI: Custom string `nextButton` set for the `welcome` step is now displayed
- Internal: Fixed flaky UI tests by adding functions that wait until the elements are located or clickable

## 5.4.0 - 2019-10-03
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

## 5.3.0 - 2019-09-03
### Added
- UI: User can now drag and drop images on desktop uploader
- Public: Option to configure click on overlay behaviour when SDK presented modally using `shouldCloseOnOverlayClick` option
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

## 5.2.3 - 2019-07-18
### Fixed
- Public: Removed tarball as a way to import wpt library. The package is now imported as a dev-dependecy and is pointing at the new Woopra repository on github.

## 5.2.2 - 2019-06-19
### Added
- Internal: Better automation of the release process
- UI: Accessibility - Make screenreader navigation work in modal mode

### Changed
- Public: Use tarball when importing wpt library

### Fixed
- Public: Fixed bug where double clicking on Send Link button then skips straight to Complete screen
- Public: Fixed scrollbar appearing on some machines/devices

## 5.2.1 - 2019-05-30
### Added
- UI: Accessibility - Announce validation error on cross device SMS link screen

### Changed
- UI: Accessibility - Update all visually obvious lists to use the relevant HTML list elements

### Fixed
- Public: When glare is detected, onComplete callback returns doc id

## 5.1.0 - 2019-05-23
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

## 5.0.0 - 2019-04-01
### Changed
- Public: If the SDK is initialised with only one document type, users will not see the document selection screen, instead they will see the capture screen straight away.
- Internal: Woopra is no longer polluting the global window object

### Fixed
- Public: Fixed issue where the user is prompted to submit the same document capture twice and fixed broken custom input UI by adding higher CSS specificity
- Internal: We are using an updated version of socket.io server, which allows for better horizontal scalling.

## 4.0.0 - 2019-03-18
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

## 3.0.0 - 2019-03-18
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

## 3.1.0 - 2019-01-28
### Added
- Public: Added Proof of address `poa` step where users can capture their proof of address documents. This is a beta feature.
- Internal: Further device metadata submitted to Onfido API
- Internal: Upload fallback for the `face` step can be disabled by using the option `{ uploadFallback: false }`. The default value is `true`
- Internal: Added multi-frame capture for the `standard` variant of the face step (only for camera capture).

### Changed
- Internal: Cross device client can now only be opened on mobile browsers. Users trying to open the link on a desktop browsers will see an error.
- Internal: Removed unused development dependencies which had known vulnerabilities

## 3.0.1 - 2018-12-19
### Fixed
- Internal: Fixed an infinite loading loop that happened when video liveness is enabled and if, and only if, users transitioned from a desktop browser that support video liveness to a mobile browser that does not support video liveness

## 2.8.0 - 2018-09-20
### Changed
- UI: Documents can be enlarged for inspection
- UI: Camera warnings are now dismissible
- UI: Title copy change on video confirmation screen

### Fixed
- Public: Fixed error with missing stream recording
- UI: Fixed document selector UI on IE11
- UI: Fixed overlapping footer and buttons on confirmation screen on Firefox

## 2.7.0 - 2018-09-03
### Added
- Public: Introduced ability to capture videos on the face step. Developers can now request a preferred variant for the face step, by adding the option `requestedVariant: 'standard' | 'video'`. If empty, it will default to `standard` and a photo will be captured. If the `requestedVariant` is `video`, we will try to fulfil this request depending on camera availability and device/browser support. In case a video cannot be taken the face step will fallback to the `standard` option. At the end of the flow, the `onComplete` callback will return the `variant` used to capture face and this can be used to initiate the facial_similarity check.

### Changed
- Public: The `onComplete` callback now returns an object including the `variant` used for the capture step. The variant can be used to initiate the facial_similarity check. Data returned: `{face: {variant: 'standard' | 'video'}}`.
- UI: Selfie UI to adopt full container layout on desktop.
- Internal: CSS namespacing now includes the full path of the component, to mitigate chances of name collision. Only impacts components nested in another component folder.

## 2.6.0 - 2018-08-08
### Changed
- Internal: Changed assets url to point at https://assets.onfido.com/

## 2.5.0 - 2018-07-27
### Added
- UI: Added a permission priming screen to inform the user that camera permissions must be enabled.
- UI: Added a permission recovering screen in case user media permissions are denied.
- UI: Added intro screen when entering cross device flow.

### Changed
- UI: Changed UI for face capture step. On small screens it will display a full screen camera component.
- UI: Desktop - If webcam is not available, a cross device intro screen will be shown to allow the user to take a live photo on their mobile phones.

## 2.4.1 - 2018-05-18
### Fixed
- Public: Fixed bug where hitting Enter key on the SMS input number was causing page reload.

## 2.4.0 - 2018-05-17
### Added
- Public: Added `documentTypes` to the `document` step options, which allows to filter the document types.

### Changed
- Internal: Refactored layout to better handle presence of header and footer elements.
- Internal: On cross device client clear error message when configuration is received.

## 2.3.0 - 2018-04-17
### Added
- Public: Added `onModalRequestClose` options, which is a callback that fires when the user attempts to close the modal.

### Deprecated
- Internal: Removed references to `useWebcam` option from README.md and return console warning if the option is used.

### Fixed
- Public: Fixed `complete` step to allow string customization at initialization time.
- Internal: Fixed the `tearDown` method to clear the onComplete callback functions.

## 2.2.0 - 2018-02-13
### Added
- Public: Added support for internationalisation. The SDK can now be displayed in Spanish by adding `{language: 'es'}` to the initialization options. It can also be displayed in a custom language by passing an object containing the custom phrases and the locale. If `language` is not present or the wrong locale tag is provided, the language locale will default to `en`.
- Public: Added support for Spanish language on the SMS body.
- Public: Added webcam support on Safari and IE Edge.

### Changed
- UI: If the webcam is facing the user it will be mirrored

## 2.1.0 - 2017-11-30
### Added
- UI: The cross device feature now supports sending the link via SMS. Users will still be able to copy the link to clipboard.
- UI: Introduced a back button that allows the user to navigate to the previous screen.
- Internal: Introduced code splitting and lazy loading

## 2.0.0 - 2017-11-08
In this version, we're introducing cross-device flow that allows to continue verification on mobile in order to take photos of your document and face.
- \*Note:\*\*
- This version is not backwards-compatible. Migration notes can be found in [MIGRATION.md](MIGRATION.md)

### Changed
- Public: Changed the behaviour of `onComplete` callback. It used to return an object that contained all captures, now it doesn't return any data.

### Removed
- Public: Removed `onDocumentCapture` that used to be fired when the document had been successfully captured, confirmed by the user and uploaded to the Onfido API
- Public: Removed `onFaceCapture` callbacks that used to be fired when the face has been successfully captured, confirmed by the user and uploaded to the Onfido API.
- Public: Removed `getCaptures` function that used to return the document and face files captured during the flow.
- Internal: Removed confirm action

## 1.1.0 - 2017-09-05
### Added
- UI: Introducing glare detection feature for documents. Not available for documents in PDF format yet.
- Internal: Added confirm step to router history and tracking

### Changed
- UI: Improved how errors and warnings are displayed on the UI
- UI: Improved navigation between steps when using the browser navigation buttons
- Internal: Improved event tracking
- Internal: Upgraded Preact to latest version

## 1.0.0 - 2017-08-01
### Changed
- Bumping version to 1.0.0 because SDK has already been implemented in production integrations. Also SDK now integrates with [Onfido API](https://documentation.onfido.com).
- Public: Support uploading documents and live photos to the Onfido API through use of new SDK tokens (JWT v2)

### Removed
- Public: Face no longer supports PDF upload in order to align with the Onfido API.

## 0.15.1 - 2017-06-29
### Changed
- Internal: replaced the has_webcam checker with a more robust version that periodically checks if the state changed
- Internal: Increased the file size upper limit to 10 MB.

### Fixed
- Internal: Fixed problem on certain versions of Firefox that no longer supported the old version of getUserMedia
- Internal: Fixed the `tearDown` method to clear the documents and faces currently in the store
- Internal: Fixed PDF preview issues on IE Edge, IE11 and mobile browsers.
- Internal: Fixed lower resolution webcams not working on Firefox

## 0.15.0 - 2017-06-15
### Changed
- Internal: Use HTTP protocol to post documents to the server instead of websockets

### Fixed
- Public: Fixed intermittent connection problem

## 0.14.0 - 2017-05-23
### Added
- Public: Capture the reverse side of driving licenses and ID cards.
- Public: Add a file size limit of 4 MB in line with the Onfido API.

### Changed
- Public: Document and face captures will be returned by callbacks as File or Blob instead of base64.
- Internal: Callbacks are now linked to the flow rather than the Redux store.

### Fixed
- Internal: Read exif tags to orientate images correctly.

## 0.13.0 - 2017-03-21
### Changed
- Public: Change the default to use file upload rather than the webcam for document captures.
- Internal: Fix dependencies to avoid bugs due to changes in minor updates.

## 0.12.0-rc.1 - 2017-02-04
### Changed
- Internal: Change the signature expected from the websockets server.

### Fixed
- Public: The documentType in the capture object now corresponds to the API document_types.
- Public: Fixed bug where URL path was removed between steps.

## 0.11.1 - 2017-02-03
### Fixed
- Public: Fixed bug where `Onfido.getCaptures()` and `onComplete(hash)` was returning a broken hash.
- Internal: Froze dependencies which were causing the upload document and pdf preview not to work.

## 0.11.0 - 2017-01-11
### Added
- Public: tearDown method to remove the SDK elements.

### Changed
- Internal: Removed `preact-router`.
- Public: Removed URL routes for each step of the SDK flow.
- Internal: Removed unused components - Dropdown and ActionBar.
- Internal: Use the staging backend when in development.
- Updated version of onfido-sdk-core to 0.7.1.

## 0.10.0 - 2016-12-08
### Added
- Public: Uploaded PDF files are now supported and returned by the callbacks as base64.
- Internal: PDF files are displayed in the confirmation step as an embedded object, which means the browser needs to support pdf files in order for them to be visible.

### Changed
- Internal: Use `visibilityjs` to pause captures when the tab is inactive.
- Internal: The copy of the document not found error message was changed.
- Internal: Changed the order of the document selection to passport, driver's license and identity card.
- Public: The returned webcam captures now have a resolution of 960x720, or lower if the webcam does not support it.
- Internal: The confirmation step for webcam captures now displays the new high resolution images.
- Internal: Updated `react-webcam-onfido` in order to get the higher resolution functionality.

## 0.9.0 - 2016-11-28
### Changed
- Public: document and face callback are now passed only their respective capture, instead of both their captures.
- Public: document and face callback are now only called after the user has confirmed the capture
- Public: document, face and complete callback can be called multiple times, if the condition that triggers them is met more than once (eg. if the user goes back to redo the capture steps)
- Internal: callbacks' returned value now have no impact on the event dispatcher.

### Fixed
- All captures have now a default no op function. This fixes an exception raise (in case some callbacks where not defined), which caused the rest of the callbacks not to be called after the exception was raised.

## 0.8.4 - 2016-11-14
### Fixed
- Updated `react-webcam` to the onfido fork, this fixes the issue where the webcam canvas (used to obtain screenshots) has 0 height under certain circumstances (namely on windows machines running Chrome). This bug, when it happened, caused the document capture step not to work.

## 0.8.3 - 2016-11-04
### Added
- Started tracking fatal exceptions and page views of the SDK.

## 0.8.2 - 2016-10-25
### Added
- Public: An error message is now shown if the upload file has as unsupported file type.

### Fixed
- Fixed bug of a broken layout on the document selection step. Always reproducible on IE and on other browsers too, but only when going back a step on certain conditions.
- Fixed bug where on IE an unnecessary scrollbar appeared and the scrolling area was bigger than it should have been.

## 0.7.0 - 2016-10-16
### Changed
- Public: `onComplete` event now fires only after both the document and face captures have been confirmed in the UI
- Internal: updated `onfido-sdk-core` to 0.5.0 which causes the all capture event to be triggered when captured are both valid and confirmed
- Internal: made the confirm button change the state of the capture to confirmed

### Fixed
- Internal: sometimes when document was retaken multiple times the capture ended up squashed. This was fixed by upgrading to `react-webcam@0.0.14`.
- Internal: fixed [Bug #36](https://github.com/onfido/onfido-sdk-ui/issues/36), it caused the face to be captured every second after a document retake.

## 0.8.1 - 2016-10-12
### Fixed
- `Object.assign` was being used but not polyfilled. Its occurrence was replaced with an es6 object construction.
- UI disappeared if the browser's windows width was smaller than 481px;

## 0.8.0 - 2016-10-10
### Added
- Public: The capture screen UI now includes an upload button fallback, for whenever the user experiences problems with the webcam.
- Internal: When requesting to validate documents there is now a strategy to cope with slow responses from the server. If the number of unprocessed documents is 3+, the client stops sending more requests until a response is given.
- Internal: `webp` falls back to `jpeg` in case the browser does not support it.

### Changed
- Public: Captures are now returned as `png` instead of `webp`, although `webp` is still used internally for streaming to the server.
- Public: the captures returned by `Onfido.getCaptures()` have a simplified signature of just `{id,image,documentType}`.
- Public: It's now possible to open and close the modal by calling `.setOptions({isModalOpen:boolean})`
- Internal: The modal has been refactored to be fully reactive, `vanilla-modal` has been replaced with a fork of `react-modal`.
- Internal: Updated to `onfido-sdk-core@0.6.0`, selectors are now more general as in they are no longer specific to each capture type, some new selectors are also being used.
- Internal: `Camera`, `Capture` and `Uploader` have been refactored, the pure part of the components have been separated from the state logic part. This adds flexibility and encapsulation.
- Internal: The `Capture` component now orchestrates all the state logic of the `Uploader` component, this allows to join the camera and uploader state logic together.

## 0.6.1 - 2016-08-02
### Added
- Public: it's now possible to change the init options at runtime by calling `setOptions()` on the object returned by `Onfido.init()`
- Public: `useWebcam` option added to the facial and document capture step

### Changed
- Public: `Onfido.init()` now returns an object.
- Internal: `isDesktop` detection is now based on [DetectRTC][detectrtc]'s `isMobile` detection
- Internal: improved Webcam Detection, it now takes into account whether a Webcam exists and if the user has given the website permission to use it. Before it was only checking whether the **getUserMedia** API is supported by the browser or not. [DetectRTC][detectrtc] is used for this detection.

## 0.5.1 - 2016-07-29
### Fixed
- SDK Core dependency update, fixes issue https://github.com/onfido/onfido-sdk-ui/issues/25
  **Note:** This update only changes the dist folder release, npm releases get the dependency update if they do `npm install`

## 0.5.0 - 2016-07-27
### Added
- API: Flow customization option `steps:[]`
- UI: Overlay to the webcam document capture (**Possibly breaking change**)
- DOC: Integration examples to documentation

### Fixed
- NPM (commonjs2) style of importing the library now works
