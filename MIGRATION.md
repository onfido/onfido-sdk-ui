# UI Customisation styling attributes v14.44.0

- All subtitles have been changed to regular text. The following related styling attributes have been removed:

  - `fontSizeSubtitle`
  - `fontFamilySubtitle`
  - `fontWeightSubtitle`
  - `colorContentSubtitle`

- ‘Link’ buttons have all been converted to proper buttons. The following related styling attributes have all been removed:

  - `colorBackgroundLinkHover`
  - `colorBackgroundLinkActive`
  - `colorContentLinkTextHover`
  - `colorBorderLinkUnderline`

- InfoPill has been removed from the cross-device screens. The following related styling attributes have been removed:

  - `colorBackgroundInfoPill`
  - `colorContentInfoPill`

- `colorBackgroundIcon` styling attributes also has been removed

# Breaking Changes

This documents the breaking changes between the Web SDK v13.7.0 and the Web SDK v14+.

## General changes

- The "split bundle" library will no longer be available on `npm`. Please use the default `npm` package instead.
- The separate `style.css` import is no longer required as the Onfido stylesheet is included in the main library.
- The import changed from `import { init } from 'onfido-sdk-ui'` to `import { Onfido } from 'onfido-sdk-ui'`

## Visual & Flow changes

- The default screen size of the Web SDK has changed on desktop:
  **Until version 13 `510px x 598px`**

  ```javascript
  width: 94vw;
  max-width: 32em;
  height: 37.5em;
  // Results in width: 510px, height: 598px (by 16px font-size)
  ```

  **From version 14 onwards - `600px x 800px`**

  ```javascript
  width: 100%;
  height: 100%;
  max-width: 600px;
  max-height: 800px;
  min-height: 600px;
  ```

- The "Capture Guide" screen has moved earlier in the document capture flow
- The "Completion" screens at the end of the cross-device flow have been streamlined and no longer show differences between the document and face capture steps
- Cross-device flow change: the user is now prevented from going cross-device after the first side (front) has already been captured. The full capture flow has to be either on the desktop or on the mobile device
- The `crossDeviceClientIntroProductName` subtitle customization option has been removed. Please use the standard language customization process to override the entire subtitle
- Merger of options `_crossDeviceLinkMethods: ['qr_code' | 'copy_link' | 'sms']` and `_initialCrossDeviceLinkView` into `_initialCrossDeviceLinkView: ['qr_code', 'copy_link', 'sms']` where the default cross-device option is the first element in the list. Note the change in separators from `|` to `,`

## `Onfido.init()` parameters

- `onUserExit` has been removed and the `user_consent_denied` type is now returned in the `onError` callback
- Ability for the Web SDK to self-load in a modal has been removed:
  - `onModalRequestClose`
  - `useModal`
  - `isModalOpen`
  - `shouldCloseOnOverlayClick`
  - `autoFocusOnInitialScreenTitle`
- Removal of `uploadFallback` option for the `document` and `face` steps. This feature is now only configurable in the Onfido systems.
- `useMemoryHistory` has been removed
- `handle.setOptions()` has been removed, no longer allowing changing options after bootstrapping the SDK
- The fallback options under the `face` step now only occur on the mobile session of a user as all fallbacks due to device capabilities will always trigger a cross-device flow first.
- `tearDown` now returns a Promise
- `safeTearDown` has been removed, please use `tearDown` instead
