# Onfido Smart Capture Web SDK

[![Build Status](https://travis-ci.org/onfido/onfido-sdk-ui.svg?branch=master)](https://travis-ci.org/onfido/onfido-sdk-ui)
[![npm version](https://img.shields.io/npm/v/onfido-sdk-ui)](https://www.npmjs.com/package/onfido-sdk-ui)

## Table of contents

- [1. Overview](#overview)
- [2. Importing the library](#importing-the-library)
- [3. Initializing the SDK](#initializing-the-sdk)
- [4. Cross-device navigation](#cross-device-navigation)
- [5. Completing a session](#completing-a-session)
- [Advanced flow customization](#advanced-flow-customization)
- [Advanced callbacks](#advanced-callbacks)
- [Self-hosted cross-device URL](#self-hosted-cross-device-url)
- [More information](#more-information)

## Overview

The Onfido Smart Capture SDKs provide a set of screens and functionality allowing applications to implement user identity verification flows. Each SDK contains:

- Carefully designed UX to guide your customers through the different photo or video capture processes
- Modular design to help you seamlessly integrate the different photo or video capture processes into your application's flow
- Advanced image quality detection technology to ensure the quality of the captured images meets the requirement of the Onfido identity verification process, guaranteeing the best success rate
- Direct image upload to the Onfido service, to simplify integration
- A suite of advanced fraud detection signals to protect against malicious users

All Onfido Smart Capture SDKs are orchestrated using [Onfido Studio](https://documentation.onfido.com/getting-started/onfido-studio-product) workflows with only minor customization differences between the available platforms.

The Onfido Web SDK is specifically designed for integrating web applications and easily managing cross-device experiences.

![Various views from the SDK](demo/screenshots.jpg)

### Environments and testing with the SDK

Two environments exist to support the Onfido SDK integrations:

- 'sandbox' - to be used for testing with sample documents
- 'live' - to be used only with real documents and in production apps

The environment being used is determined by the API token that is used to generate the necessary [SDK token](#sdk-authentication).

### Going Live

Once you are satisfied with your integration and are ready to go live, please contact Onfido's [Customer Support](mailto:client-support@onfido.com) to obtain a live API token. You will have to replace the sandbox token in your code with the live token.

Check that you have entered correct billing details inside your [Onfido Dashboard](https://onfido.com/dashboard/), before going live.

## Importing the library & staying up-to-date

The Onfido Web SDK can be added to your project in two ways:

- Directly in the web application in a `script` tag or as an `import`
- As part of your project build as a library imported from [NPM](https://www.npmjs.com/package/onfido-sdk-ui)

To benefit from the latest features and patches released by Onfido and minimize the size of the script used, it is highly recommended to use an integration method that leverages the Onfido CDN, as detailed in the following sections.

**Note** that while Onfido hosts the CDN and ensures the script availability at runtime, any project using the SDK library from NPM would require its hosting.

### Direct CDN integration

The quickest and simplest way to integrate the Onfido Web SDK is to use the Onfido-hosted library.

From SDK 12.3.1 onwards, the version number you subscribe to can vary, depending on your needs:

- subscribing to a major release (e.g. `v14`) means Onfido will update to the latest available patch and minor release
- subscribing to a minor level release (e.g. `v14.11`) means Onfido will update to the latest available patch release
- subscribing to a specific patch release (e.g. `v14.11.0`) will fix the library files to that SDK release

### Importing the SDK in an html `script` tag

```html
<!-- Replace "<version>" with the actual SDK version you want to use, example: v14.11.0 -->
<script src="https://sdk.onfido.com/<version>" charset="utf-8"></script>
```

**Note** that prior to [version 12.3.1](https://github.com/onfido/onfido-sdk-ui/blob/12.3.0/README.md#43-cdn), the CDN path was `https://assets.onfido.com/web-sdk-releases/<version>/onfido.min.js`.

Also note that from version 14 onwards, a separate stylesheet is no longer required as it will be included with the default library.

### Importing the SDK with a JavaScript `import` directive

The library can also be invoked directly within an object or component:

```javascript
// ES6 module import
import { Onfido } from 'onfido-sdk-ui'

// commonjs style require
var Onfido = require('onfido-sdk-ui').Onfido
```

The CSS style will be included inline with the JS code when the library is imported.

**Note**: The library is Browser only, it does not support the Node Context.

### Integrating with an NPM package

NPM is a public repository of libraries available for download and integration into web/native apps. Onfido has been publishing all its SDKs there for convenience to customers.

The Web SDK version 14 will continue with the existing [package name](https://www.npmjs.com/package/onfido-sdk-ui):

```bash
npm install onfido-sdk-ui
```

or

```bash
yarn add onfido-sdk-ui
```

From version 14 onwards, the `onfido-sdk-ui` package will, by default, be connected to the Onfido CDN. In addition to the benefits of using a CDN and the library being directly in your build process, core functions will also be typed when used with [Typesript](#typescript).

<Callout type="warning">

> From version 14 onwards, "split bundles" are no longer supported. Onfido recommends the use of either the direct or NPM CDN integration.

</Callout>

#### NPM package version pinning

In order to facilitate integration and A/B tests, the CDN-powered NPM package will also **optionally** support the ability to specify a version (major, minor or patch) of the Onfido Web SDK library.

NPM bundle is by default evergreen and subscribes to the latest major version of the SDK. More details are provided in the [SDK version pinning](#version-pinning) section below.

#### TypeScript

Since version `6.5.0`, TypeScript is officially supported.

Available types:

- `OnfidoApi` - The base type for the `Onfido` object
- `SdkParameters` - The parameters passed into `Onfido.init()`

## Initializing the SDK

> ⚠️ The following SDK initialization documentation applies to identity verification workflows orchestrated using Onfido Studio.
> For integrations where the verification steps are manually defined and configured, please refer to the [Advanced flow customization](#advanced-flow-customization) section below.

The Web SDK has multiple initialization and customization options that provide flexibility to your integration, while remaining easy to integrate.

**Note** that from version 14, it will no longer be possible to change initialization options at runtime as was previously allowed with the `setOption()` function.

### Defining a workflow

Onfido Studio is the platform used to create highly reusable identity verification workflows for use with the Onfido SDKs. For an introduction to working with workflows, please refer to our [Getting Started guide](https://documentation.onfido.com/getting-started/general-introduction), or the Onfido Studio [product guide](https://documentation.onfido.com/getting-started/onfido-studio-product).

SDK sessions are orchestrated by a session-specific `workflow_run_id`, itself derived from a `workflow_id`, the unique identifier of a given workflow.

For details on how to generate a `workflow_run_id`, please refer to the `POST /workflow_runs/` endpoint definition in the Onfido [API reference](https://documentation.onfido.com/api/latest#workflow-runs).

<Callout type="warning">

> **Note** that in the context of the SDK the `workflow_run_id` property is referred to as `workflowRunId`.

</Callout>

### SDK authentication

The SDK is authenticated using SDK tokens. Onfido Studio generates and exposes SDK tokens in the workflow run payload returned by the API when a workflow run is [created](https://documentation.onfido.com/#create-workflow-run).

SDK tokens for Studio can only be used together with the specific workflow run they are generated for, and remain valid for a period of five weeks.

**Note**: You must never use API tokens in the frontend of your application as malicious users could discover them in your source code. You should only use them on your server.

### Loading the Onfido flow

To load the Onfido flow, add an empty HTML element for the modal interface to mount itself on:

**Note**: Starting from Web SDK `v14.0.0`, the SDK container will automatically inherit 100% of the height and width of its parent wrapper. On desktop, it will be constrained by a maximum width of `600px` and a maximum height of `800px`.

If you are embedding the SDK within a `div`, `iframe`, or any other element, ensure that you adjust the dimensions of the parent container to meet your specific requirements.

```html
<div id="onfido-mount"></div>
```

With the configuration in an accompanying script:

```javascript
Onfido.init({
  token: '<YOUR_SDK_TOKEN>',
  containerId: 'onfido-mount',
  //containerEl: <div id="root" />, an ALTERNATIVE to `containerId`
  onComplete: function (data) {
    console.log('everything is complete')
  },
  workflowRunId: '<YOUR_WORKFLOW_RUN_ID>',
})
```

<Callout type="info">

> You can see an example integration of the Onfido Web SDK in our [sample app](https://github.com/onfido/onfido-sdk-web-sample-app/).

</Callout>

You may also _optionally_ specify a different container or identifier to load the Onfido flow:

- **`containerId {String}` - optional**

  ID value of the container element that the UI will mount to. The element itself needs to be an empty element. The default ID is `onfido-mount`. If your integration needs to pass the container element itself, use `containerEl` as described next.

- **`containerEl {Element}` - optional**

  Container element that the UI will mount to. This needs to be an empty element. This can be used as an alternative to passing in the container ID string previously described for `containerId`. Note that if `containerEl` is provided, then `containerId` will be ignored.

### Integrating in a webview

While webviews provide a lightweight integration and simplify cross-platform development, they have limitations in terms of accessing device features such as the camera, microphone, and local files as they rely on the webview engines provided by the operating system. As such webviews don’t offer the same level of performance and user experience as the functionality of the Onfido mobile SDKs in native apps.

Where possible, Onfido recommends using its native mobile SDKs for optimal performance.

Please refer to this [guide](https://documentation.onfido.com/sdk/sdk-webview-guide) for more details about how to integrate the Onfido Web SDK in a webview.

### Version pinning

NPM bundle is by default evergreen and subscribes to the latest major version of the SDK.
Based on the same major version, the minor and patch versions of the library can be specified in the `Onfido.init()` object.

- **`version {String}` - optional**

  The specific version of the Onfido Web SDK that should be loaded as part of this initialization. A full version (e.g. `v14.12.1`) or just a minor version (e.g. `v14.13`) can be specified. When a minor version is specified, the latest patch version for that minor release will be loaded.
  Example: `version: "14.12.1"`

**Note**: This parameter is only effective when the library is imported as npm bundle (as opposed to the default CDN-powered NPM package).

### Styling customization

The Onfido Web SDK supports customization options to adjust the fonts, the SDK main container, buttons, links, icons, background color and popups.

The Web SDK also supports dark theme customization.

To customize the SDK, you can pass the required values to the `theme` object, in the root of the `Onfido.init()` object.

- **`name {Object}` - required**

  The theme's `name` object allows for **dark mode** customization by setting the value to `light` or `dark`.

- **`config {Object}` - optional**

  The theme's `config` object caters for a range of optional CSS values for supported UI customization. The sample below lists all possible options with some example values:

```javascript
{
  "theme": {
    "name": "light", // or "dark",
    "config": {
      "borderRadiusButton": "56px",
      "borderStyleSurfaceModal": "0px",
      "fontWeightBody": 400,
      "fontSizeBody": "16px",
      "fontSizeSubtitle": "16px",
      "fontSizeTitle": "40px",
      "colorBackgroundSurfaceModal": "transparent",
      "colorBackgroundIcon": "transparent",
      "colorBorderLinkUnderline": "transparent",
      "colorBackgroundLinkActive": "transparent",
      "colorBackgroundLinkHover": "transparent",
      "colorBackgroundDocTypeButton": "transparent",
      "colorContentBody": "rgb(255,255,255)",
      "colorContentTitle": "rgb(255,255,255)",
      "colorContentSubtitle": "rgb(255,255,255)",

      "colorContentButtonPrimaryText": "rgb(10,11,13)",
      "colorBackgroundButtonPrimary": "rgb(55, 115, 245)",
      "colorBackgroundButtonPrimaryHover": "rgb(55, 115, 245)",
      "colorBackgroundButtonPrimaryActive": "rgb(55, 115, 245)",

      "colorContentButtonSecondaryText": "rgb(255,255,255)",
      "colorBackgroundButtonSecondary": "rgb(50,53,61)",
      "colorBackgroundButtonSecondaryHover": "rgb(30,32,37)",
      "colorBackgroundButtonSecondaryActive": "rgb(30,32,37)",
      "colorContentLinkTextHover": "rgb(55, 115, 245)",
      "colorBorderDocTypeButton": "rgb(20, 21, 25)",
      "colorBackgroundDocTypeButtonHover": "rgb(30,32,37)",
      "colorBackgroundDocTypeButtonActive": "rgb(30,32,37)",
      "colorContentDocTypeButton": "rgb(255,255,255)",
      "colorIcon": "rgb(55, 115, 245)",
      "colorContentInfoPill": "rgb(10,11,13)",
      "colorBackgroundInfoPill": "rgb(55, 115, 245)",
      "colorBackgroundSelector": "red",
      "colorBackgroundDropdownItemHover": "rgb(30,32,37)",
      "colorInputOutline": "rgb(87, 139, 250)",
      "colorContentButtonTertiaryText": "rgb(255,255,255)",
      "colorContentInput": "blue",
      "colorBackgroundInput": "green",
      "colorBorderInput": "yellow"
    }
  }
}

```

<Callout type="info">

> For use in a webview on a mobile device, it is recommended to set up the SDK to use the full screen of the device. Otherwise, there may not be enough room to display all critical elements of the SDK.

</Callout>

**Note** that from version 14, the Onfido SDK options to load the screens in a modal have been deprecated. If you wish to load the Onfido screens in a modal you will have to define it as part of your own integration.

### Co-branding

The Onfido SDK allows for two co-branding options that affect the display of the Onfido logo at the bottom of the Onfido screens.

For further customization, please contact your Onfido Solution Engineer or Customer Success Manager.

#### Text co-branding

- **`cobrand {Object}` - optional**

  The most effective way to add your brand to the footer watermark, is by use of the `cobrand` property under `enterpriseFeatures`. This property takes a `text` parameter.

  ![Example of text cobranding](demo/text_co_brand.png)

```javascript
Onfido.init({
  ...
  enterpriseFeatures: {
    cobrand: {
      text: "Onboarding, Inc."
    }
  },
})
```

#### Logo co-branding

- **`logoCobrand {Object}` - optional**

  As an alternative to `cobrand`, you may specify a set of images to be defined in the `logoCobrand` property under `enterpriseFeatures`. You must provide the path to an image for use in 'dark' mode and a separate image for 'light' mode. Both images must have a resolution of 144x32.

```javascript
Onfido.init({
  ...
  enterpriseFeatures: {
    logoCobrand: {
	    darkLogoSrc: "https://YourLogoImageUrlOrFilePath",
	    lightLogoSrc: "https://YourLogoImageUrlOrFilePath",
    }
  },
})
```

### Language, translations and custom text

The Onfido SDKs support translations for over 40 languages, as well as the ability to integrate custom text and languages.

Defining a default language and applying custom translations or text is done with the `language` and `translations` properties at the root of the `Onfido.init()` call.

#### Language selection

- **`language {String}` - optional**

  You can specify the language displayed during the SDK session. The `string` identifier can either be one of Onfido's supported languages (full list available in the [SDK customization guide](https://documentation.onfido.com/sdk/sdk-customization/#supported-languages)) or your own custom language identifier as described in the [Using custom language files](#using-custom-language-files) section below.

```javascript
Onfido.init({
  ...
  language: 'pt_BR'
})
```

<Callout type="info">

If the `language` property is not present, the language identifier is incorrect or not yet supported by Onfido, the SDK will use the browser's language setting. <br/>
If the browser's language is not supported by Onfido, the SDK will default to English (`en_US`).

</Callout>

**Note**: In the context of cross-device and OTP, the language of the SMS body is also controlled by this identifier.

#### Custom translations and text

In addition to selecting a default language for the SDK session, the SDK can also be initialised with custom text and translations for each required language.

- **`translations {Object}` - optional**

  You can specify custom text and translations by overriding individual text strings for all languages required by your implementation. The structure of each language file, including all available keys, is described in the next section.

```javascript
Onfido.init({
  ...
  translations: {
    en_US: {
      welcome: {
        title: 'This custom title will appear by default for en_US'
      }
    },
    es: {
       welcome: {
         title: 'Este título personalizado aparecerá por defecto para es'.
       }
    }
  }
})
```

#### Identifying language keys

The full list of keys that can be customized in the Onfido Web SDK is available on the Onfido CDN and is split by module and language.

| File URL                                                                    | Description                                                                         |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| https://sdk.onfido.com/capture/i18n/common/en_US.json                       | Flow level keys, country names, document types and other keys shared across modules |
| https://sdk.onfido.com/capture/i18n/welcome/en_US.json                      | Welcome screen                                                                      |
| https://sdk.onfido.com/capture/i18n/complete/en_US.json                     | "Thank you" screen                                                                  |
| https://sdk.onfido.com/capture/i18n/consent/en_US.json                      | Consent screen                                                                      |
| https://sdk.onfido.com/capture/i18n/error/en_US.json                        | General error screens                                                               |
| https://sdk.onfido.com/capture/i18n/retry/en_US.json                        | Retry screen                                                                        |
| https://sdk.onfido.com/capture/i18n/crossdevice/en_US.json                  | Cross-device screens for both desktop and mobile sessions                           |
| https://sdk.onfido.com/capture/i18n/document/en_US.json                     | Document Capture screens                                                            |
| https://sdk.onfido.com/capture/i18n/proofOfAddress/en_US.json               | Proof of Address screens                                                            |
| https://sdk.onfido.com/capture/i18n/face/en_US.json                         | Face Capture - Selfie screens                                                       |
| https://sdk.onfido.com/capture/i18n/faceVideo/en_US.json                    | Face Capture - Video screens                                                        |
| https://sdk.onfido.com/capture/i18n/motion/en_US.json                       | Face Capture - Motion screens                                                       |
| https://sdk.onfido.com/capture/i18n/profileData/en_US.json                  | Profile Data screens                                                                |
| https://sdk.onfido.com/capture/i18n/electronicId/en_US.json                 | Electronic ID verification screens                                                  |
| https://sdk.onfido.com/capture/i18n/ial2/en_US.json                         | IAL2 screens                                                                        |
| https://sdk.onfido.com/capture/i18n/qualifiedElectronicSignature/en_US.json | Qualified Electronic Signature (QES) screens                                        |
| https://sdk.onfido.com/capture/i18n/oneTimePassword/en_US.json              | One-Time-Password (OTP) screens                                                     |

**Note** that the same keys are available across all supported languages and are accessible by specifying the appropriate language name in the URL (`en_US.json` in the example above).

It is also possible to identify text that can be customized by using a browser inspector and indentifying `div` blocks with the attribute name `data-i18n-token`.

![Example of how to use an html inspector to find a text key](demo/inspector.png)

<Callout type="info">
  To assist migrations from the Onfido Web SDK version 13 and earlier, mapping is provided for each previously supported screen in the `legacy` subsection of the aforementioned `json` files.
</Callout>

#### Using custom language files

The Onfido Web SDK allows the use of custom languages alongside all officially supported languages.
This functionality is achieved by:

- defining a unique `language` identifier
- using the unique `language` identifier within the `translations` object, mapping any required strings to the existing language file structure

```javascript

Onfido.init({
  ...
  language: 'MY_CUSTOM_LANG',
  translations: {
    MY_CUSTOM_LANG: {
      welcome: {
        title: 'This custom title will appear by default'
      }
    }
  }
})
```

**Note**: Custom languages, similarly to standard text overrides, work as 'delta' to the base language file they relate to. In the case of custom languages, that base language is `en_US`.

### Cross-device navigation

The Web SDK offers a cross-device flow where desktop users are directed to continue on their mobile device browser to complete the capture process. This provides a vastly improved image quality versus a typical desktop webcam and increases the likelihood of successful live capture.

![Force cross-device flow](demo/cross-device.png)

Three options are offered to the user to resume the flow on a mobile device browser:

- QR code that can be scanned with a camera app (default)
- 'Copy Link' feature that can be copy/pasted into a web browser
- One-time SMS link that can be sent directly to the user's mobile phone

Regardless of the cross-device method, the secure URL is unique to this session.

At the end of the capture process, users will be instructed to revert back to their desktop to complete the SDK flow.

**Note** that during a capture sequence on a desktop device, if a camera cannot be detected, the user is forwarded directly to the cross-device flow in order to attempt the capture on another device.

**Also note** that One-Time SMS links **cannot** be sent to the following regions and the messages will not be delivered:

**North America**

- Cuba
- Haiti

**Asia**

- Afghanistan
- Bhutan
- East Timor
- Iran
- Iraq
- Democratic People's Republic of Korea
- Laos
- Lebanon
- Myanmar
- Palestinian Territory
- Syria
- Tajikistan
- Yemen

**Africa**

- Burkina Faso
- Burundi
- Cape Verde
- Central Africa
- Chad
- Comoros
- Djibouti
- Equatorial Guinea
- Eritrea
- Guinea Bissau
- Liberia
- Libya
- Madagascar
- Mauritania
- Niger
- Somalia
- South Sudan
- Sudan
- Zimbabwe

For more information regarding region blocking, please contact Onfido's [Customer Support](mailto:support@onfido.com).

#### Enforcing cross-device navigation

In order to optimize the capture quality, it is recommended to enforce the cross-device flow. The option is available in Onfido Studio, configurable in the [workflow builder](https://documentation.onfido.com/getting-started/onfido-studio-product#document-capture-task).

Cross-device can also be enforced at run-time using the following initialization option:

- **`crossDevicePolicy {String}` - optional**

  By default, the cross-device flow is not enforced but shown to the user alongside a button to upload a document instead. You can force the user to capture a document or face on a mobile device by either:

- setting the option globally (across all workflow runs) in the [workflow builder](https://documentation.onfido.com/getting-started/onfido-studio-product#document-capture-task)

- setting the `crossDevicePolicy` initialization option at runtime to either `force` or `disable` to completely remove the option

  ```javascript
  crossDevicePolicy: 'force'
  ```

#### Customizing the cross-device experience

In addition to forcing the cross-device flow, the cross-device experience can be further customized during the SDK initialization with the following options:

- **`_crossDeviceLinkMethods {List<String>}` - optional**

  You can specify which of the three cross-device link options are presented to the user by adding any of `qr_code`, `copy_link` and/or `sms` to the `_crossDeviceLinkMethods` using a `,` as a separator. The first element of the list will be the **default** option shown to the user. Note the underscore at the start of the string.

  ```javascript
  _crossDeviceLinkMethods: ['qr_code', 'copy_link', 'sms']
  ```

- **`smsNumberCountryCode {String}` - optional**

  You can change the default country for the SMS number input by passing the `smsNumberCountryCode` option at the root of the `Onfido.init()` call when the SDK is initialized. The value should be a string containing a 2-character ISO country code. If empty, the SMS number country code will default to `GB`.

  ```javascript
  smsNumberCountryCode: 'US'
  ```

- **`userDetails {Object}` - optional**

  The following user details can be specified ahead of time, so that the user doesn't need to provide the information themselves:

  - `smsNumber` (optional) : The user's mobile number can be added to the optional `userDetails` object at the root of the `Onfido.init()` call. The value should be a string containing the mobile number with a country code.

  ```javascript
  userDetails: {
    smsNumber: '+447500123456'
  }
  ```

- **`crossDeviceClientIntroProductLogoSrc {String}` - optional**

  You can customize the icon by adding your company or product logo to be displayed instead of the default SDK icon image with this option. The image referenced in the path should be no more than 144px in both height and width.

  ```javascript
  Onfido.init({
    ...
  	crossDeviceClientIntroProductLogoSrc: "path://to/logo/image/file",
  });
  ```

**Note** that from version 14, the `crossDeviceClientIntroProductName` option used in previous versions to modify just the customer name in the cross-device intro screen has been deprecated. Instead, you should use the standard [language customization](#language-customization) process to override the subtitle of the screen.

#### Cross-device experience: beta features

In an effort to provide more flexibility and security to the cross-device experience, new features are gradually
being introduced in the main user flow.
The capabilities listed below are available to all integrations using the Web SDK version 14.44 and above.
For more information and activation, please contact [Customer Support](mailto:support@onfido.com) or your Customer
Success Manager.

| Beta feature                                                                                                                                                                                                                                                                                                                                                          |                                                                                                                                                                              |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Dynamic cross-device QR code** <br/> When enabled, the QR code displayed in the source (desktop) session will automatically refresh every 10 seconds. <br/>This feature cannot currently be used with other link methods.                                                                                                                                           |                                                                                                                                                                              |
| **User connection confirmation screen** <br/> When enabled, this new screen would appear as the first screen on the end-user's mobile device. It displays metadata relating to the source (desktop) session as well as guidance and an opportunity to drop out of the cross-device flow.                                                                              | ![Cross-device confirmation screen](demo/cross-device-confirmation.png)                                                                                                      |
| **User verification screen** <br/> This screen is provided independently of (and would appear after) the aforementioned cross-device confirmation screen. When enabled, the mobile screen would request the end-user to select the confirmation code that appears on the initiating source (desktop) screen. Incorrect entry results in the cancellation of the flow. | ![Cross-device verification desktop screen](demo/cross-device-verification-source.png) ![Cross-device verification mobile screen](demo/cross-device-verification-mobile.png) |

## Completing a session

### Handling callbacks

When the Onfido SDK session will conclude, one of two callback functions may be triggered:

- `onComplete`: the session was successful
- `onError`: the session terminated unexpectedly
- `onUserExit`(Beta): the session terminated by end user

For advanced callbacks used for user analytics and returning submitted media, please refer to the [Advanced Callbacks](#advanced-callbacks) section of this document.

#### `onComplete {Function}` - optional

Callback that fires when all the capture tasks of a workflow have successfully been executed.

```javascript
Onfido.init({
	token: "<YOUR_SDK_TOKEN>",
	...
	onComplete: function(data) {
		console.log("everything is complete");
	},
      onError: function(error) {
		console.log("an error occurred");
  }
});
```

After `onComplete` has fired in the context of a workflow, information about the files uploaded by the user during the session can be retrieved via the dedicated [Document](https://documentation.onfido.com/api/latest/#list-documents), [Selfie](https://documentation.onfido.com/api/latest/#list-live-photos) and [Video](https://documentation.onfido.com/api/latest/#list-live-videos) API endpoints.

<Callout type="warn">

While the existing implementation of `onComplete` also returns _partial_ information after a workflow has been executed, this behaviour will be removed in the next major version of the web SDK.

</Callout>

**Note**: For implementation not relying on workflows, please refer to the [Manual `onComplete` callback](#manual-oncomplete-callback) section of this guide for more details about the payload content.

#### `onError {Function}` - optional

Callback that fires when an error occurs. The callback returns the following error types:

- `invalid_token`
  This error will be returned when the SDK token is invalid or missing.

  ```javascript
  {
    type: "invalid_token",
    message: "The token is invalid."
  }
  ```

- `expired_token`
  This error will be returned when a token has expired. This error type can be used to provide a new token at runtime.

  ```javascript
  {
    type: "expired_token",
    message: "The token has expired, please request a new one"
  }
  ```

- `expired_trial`
  This error will be returned when the trial has expired.

  ```javascript
  {
    type: "expired_trial",
    message: "The trial period is expired."
  }
  ```

- `geoblocked_request`
  This error will be returned when the request is geo-blocked.

  ```javascript
  {
    type: "geoblocked_request",
    message: "The request is not allowed from this location."
  }
  ```

- `permissions_unavailable`
  This error will be returned if the SDK was unable to access or request the necessary permissions. This may occur when the Web SDK is loaded within a webview or other custom browsers.

  ```javascript
  {
    type: "permissions_unavailable",
    message: "Unable to retrieve or access required user permissions"
  }
  ```

- `unsupported`
  This error will be returned when the a module is not supported in the current environment.

  ```javascript
  {
    type: "unsupported",
    message: "The module is not supported in the current environment."
  }
  ```

- `unsupported_feature`
  This error will be returned when a feature is not supported.

  ```javascript
  {
    type: "unsupported_feature",
    message: "The feature is no longer supported."
  }
  ```

- `invalid_sdk_parameter`
  This error will be returned when the SDK is initialized with invalid parameters.

  ```javascript
  {
    type: "invalid_sdk_parameter",
    message: "The SDK is initialized with invalid parameters."
  }
  ```

- `unsupported_sdk_version`
  This error will be returned when the workflow is not supported by the SDK version.

  ```javascript
  {
    type: "unsupported_sdk_version",
    message: "The SDK version is not compatible with the workflow."
  }
  ```

- `no_camera`
  This error will be returned when the camera is not available and no other capture method is available.

  ```javascript
  {
    type: "no_camera",
    message: "The camera is not available."
  }
  ```

- `user_consent_denied`
  This error will be returned when the user exits the flow because they declined the consent.

  ```javascript
  {
  type: "user_consent_denied",
  message: "The user has declined the consent."
  }
  ```

- `exception`
  This will be returned for all unknown errors, including:

  - timeout and server errors
  - unexpected javascript errors

  This data can be used for debugging purposes.

  ```javascript
  {
    type: "exception",
    message: "The request could not be understood by the server, please check your request is correctly formatted"
    exception: Error
  }
  ```

  - `workflow_abandoned`
    This error will be returned when the user has abandoned the workflow run and it has timed out.

  ```javascript
  {
    type: "workflow_abandoned",
    message: "The workflow has been abondoned."
  }
  ```

  - `workflow_error`
    This error will be returned when there is an error with workflow run.

  ```javascript
  {
    type: "workflow_error",
    message: "The workflow run is invalid."
  }
  ```

#### `onUserExit {userAction}`(Beta) - optional  

Callback that fires when the exit button is pressed or consent is denied by the end user.

The `userAction` parameter returns one possible value:

- `user_exit` - the user pressed the exit button

The `showExitButton`(Beta) property (which defaults to `false`) is used for displaying the exit button in the Web SDK.

```javascript
Onfido.init({
  // ...other properties
  showExitButton: true / false
  onUserExit: (userAction) => {
    console.log('Exit the SDK', userAction);
  },
  // ...other properties
})
```

### SDK tear-down

If you have embedded the SDK inside a single page app, you can call the `tearDown` function to remove the SDK completely from the current webpage. It will reset the state and you can safely re-initialize the SDK inside the same webpage later on.

```javascript
onfidoOut = Onfido.init({...})
...
await onfidoOut.tearDown()
```

⚠️ **Warning**: The `tearDown` method is a Promise. If you plan on mounting the SDK a second (or nth) time, please await the promise first.

```javascript
onfidoOut = Onfido.init({...})
await onfidoOut.tearDown()
onfidoOut2 = Onfido.init({...})
```

### Generating verification reports

While the SDK is responsible for capturing and uploading the user's media and data, identity verification reports themselves are generated based on workflows created using [Onfido Studio](https://documentation.onfido.com/getting-started/onfido-studio-product).

For a step-by-step walkthrough of creating an identity verification using Onfido Studio and our SDKs, please refer to our [Quick Start Guide](https://documentation.onfido.com/getting-started/quick-start-guide).

If your application initializes the Onfido Web SDK using the options defined in the [Advanced customization](#advanced-flow-customization) section of this document, you may [create checks](https://documentation.onfido.com/api/latest#create-check) and [retrieve report results](https://documentation.onfido.com/api/latest#retrieve-report) manually using the Onfido API.
You may also configure [webhooks](https://documentation.onfido.com/api/latest#webhooks) to be notified asynchronously when the report results have been generated.

## Advanced flow customization

This section on 'Advanced customization' refers to the process of initializing the Onfido Web SDK without the use of Onfido Studio. This process requires a manual definition of the verification steps and their configuration.
The `steps` parameter is mutually exclusive with `workflowRunId`. The other parameters under `Onfido.init()` remain the same.

**Note** that this initialization process is **not recommended** as the majority of new features are exclusively released for Studio workflows.

### Manual SDK authentication

The SDK is authenticated using SDK tokens. As each SDK token must be specific to a given applicant and session, a new token must be generated each time you initialize the Onfido Web SDK.

- **`token {String}` - required**

  A JWT is required in order to authorize with the Onfido WebSocket endpoint. If the SDK token is missing, an exception will be thrown.

For details on how to manually generate SDK tokens, please refer to the `POST /sdk_token/` definition in the Onfido [API reference](https://documentation.onfido.com/#generate-sdk-token).

<Callout type="warning">

> It's important to note that manually generated SDK tokens expire after 90 minutes (SDK tokens generated in Onfido Studio when creating workflow runs are **not** affected by this limit).

</Callout>

**Note**: You must never use API tokens in the frontend of your application as malicious users could discover them in your source code. You should only use them on your server.

- **`steps {List<String>}` - optional**

  The list of user verification steps, in order of appearance. Each step can either be specified as a string (when no customization is required) or an object (when customization is required). Customization options are described in the following sections.

From the possible steps listed below, only `document` is required:

| Step       | Description                                                                                                                                                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `welcome`  | Welcome screen shown to the user with preliminary instructions. [Customization](#welcome-step) options include modification to the text elements and instructions shown to the user.                                                     |
| `document` | Set of screens that control the capture via photo or upload of the user's document. Numerous [customization](#document-step) options are available to define the document list presented to the user and the overall capture experience. |
| `face`     | Set of screens that control the capture of a selfie, video or motion of the user. The [customization](#face-step) options allow the selection of the capture variant as well as fallback options.                                        |
| `poa`      | Set of screens where the user selects the issuing country and type of document to [verify their address](#poa-step).                                                                                                                     |
| `complete` | Screen shown to the user at the end of the flow. [Customization](#complete-step) options include modifications to the text elements shown to the user.                                                                                   |

```javascript
Onfido.init({
  token: "<YOUR_SDK_TOKEN>",
  ...
  steps: [
    {
      type: "welcome",
      options: {
        title: "Open your new bank account",
      },
    },
    "document",
    "poa",
    "face",
  ];
});
```

#### `welcome` step

This step is the introduction screen of the SDK. It introduces the process and prepares the user for the steps they will need to complete. These steps can be specified to match the flow required.

While this screen is **optional**, we only recommend its removal if you already have your own identity verification welcome screen in place.

The custom options are:

- `title` (string)
- `descriptions` ([string])
- `nextButton` (string)

#### `document` step

The Document Capture step is typically organised in three parts:

- The issuing country and document type selection
- The camera capture
- The document review and upload

**Note** that the `document` step is mandatory.

The customization options available all relate to the country and document type selection screen.
By default, the selection screen is shown with the country selection being empty.

![Choose documents type](demo/choose-document.png)
_The above images are for web SDK versions 8.3.0+_

Depending on the customization options defined in this step or the 'allowed countries' defined in your [Dashboard](https://dashboard.onfido.com/), either the country or document type selection screens might not be shown:

- The country selection screen will not be shown if only 1 country is selected or if only passports are allowed
- The document selection screen will not be shown if only 1 document type is specified

You can specify allowed issuing countries and document types for the document capture step in one of three ways:

- Onfido Studio: If you are using Onfido Studio, this is configured within the Document Capture task, as documented in the [Studio Product Guide](https://documentation.onfido.com/getting-started/onfido-studio-product#document-capture-task)

- Dashboard : Otherwise, the recommended approach is to apply this configuration globally in the [Dashboard](https://dashboard.onfido.com/) under Accounts \ Supported Documents. This option also ensures that the list is enforced as part of the Document Report validation. Any document that has been uploaded by an end user against your guidance will result in a Document Report sub-result of "rejected" and be flagged as `Image Integrity` > `Supported Document`.

  ![The Supported Documents tab in Dashboard](demo/supported_documents_dashboard.png)

- Run-time: For run-time configuration, the following `options` can be defined under the `document` step:

  - **`documentTypes {Object}` - required**

    The list of document types visible to the user can be filtered by using the `documentTypes` option. When `documentTypes` is not defined, the default value for each document type is `true`. When `documentTypes` is defined, it will override the default values. Absent types are considered `false`.

  - **`country {String}` - optional**

    Document country can be specified per document type. The `country` configuration for a document type allows you to specify the issuing country of the document as a string containing a 3-letter ISO 3166-1 alpha-3 country code.

    If `documentTypes` only includes one document type with a country value, users will not see the document selection screen and instead will be taken directly to the capture screen.

    ⚠️ **Note**: the `null` value is deprecated and has no effect.

    ⚠️ **Note**: Passports have the same format worldwide so the SDK will not show the country selection screen even if they are not restricted by country (e.g. passport: true).

  - **`hideCountrySelection {Boolean}` - optional**

    It is possible to completely remove the country selection screen, showing instead the list of all possible document types directly to the user by setting `hideCountrySelection` to `true`. This is **not recommended** as it will prevent document-specific optimization of the flow and detailed analytics.

```json
{
  "steps": [
    "welcome",
    {
      "type": "document",
      "options": {
        "documentTypes": {
          "driving_licence": {
            "country": "ESP"
          },
          "national_identity_card": true,
          "residence_permit": true
        }
      }
    },
    "complete"
  ]
}
```

_In the example above only Spanish (ESP) driving licences, and national identity cards and residence permits for all countries will be shown_

**Please note:**

- Hard coding any document type and issuing country configuration in your SDK integration will fully override the Dashboard-based settings
- Currently, only passport, national ID card, driving licence and residence permit are visible for document selection by the end user in the SDK. If you nominate other document types in your Dashboard (visa, for example), these will not be displayed in the user interface
- If you need to add other document types to the document selection screen, you can mitigate this limitation in the near-term, using the [Custom Document](#custom-documents) feature
- If for any reason the configuration fails or is not enabled, the SDK will fallback to displaying the selection screen for the complete list of documents supported within the selection screens

##### Custom Documents

In case you require to capture a document that is not supported by Onfido or a supported document with a different name or scope (e.g. capturing the back of a two-sided document, even if it is not required for verification purposes), custom documents can be manually defined.

**Note** that if recognized, Onfido will still attempt to process them based on their detected classification.

- **`genericDocumentTypes {Object}` - optional**

  If defined under the `document` step `options`, the custom document will be displayed at the bottom of the standard document types list after any other document types applicable to the other optional country / document type selection options defined in the previous sections.

  ```javascript
  genericDocumentTypes: [
    {
      id: 'my_single_side_document',
      title: 'My single side document',
      subTitle: 'Details about my document',
      country: 'ALB',
      pages: 1,
    },
    {
      id: 'my_two_sides_document',
      title: 'My two sides document',
      subTitle: 'Details about my document',
      country: 'ALB',
      pages: 2,
    },
  ]
  ```

  In the same way to other document types, if you wish to skip the document selection screen, you can add a single `generic_document` object which references the custom document declared in `genericDocumentTypes`.

  ```javascript
  documentTypes: {
    generic_document: {
      id: 'my_single_side_document',
    }
  }
  ```

#### `poa` step

This is the Proof of Address capture step. Users will be asked to select the issuing country of their document, the document type, and to provide images of their selected document. They will also have a chance to check the quality of the images before confirming. There are no custom options for this step.

#### `face` step

This is the face capture step. Users will be asked to capture their face in the form of a photo, a video, or a motion capture. For photos and videos, they will also have a chance to check its quality before confirming.

**Note** that if a camera can’t be detected, the user will be forwarded to the cross-device flow in order to attempt to capture on another device. The cross-device flow will be presented to the user, **before** any optional fallback variants are assessed by the Web SDK.

##### `face` flow options

- **`requestedVariant {String}` - optional**

  A preferred variant can be requested for this step, by passing the option `requestedVariant: 'standard' | 'video' | 'motion'`, with the default version being `standard`. If `requestedVariant` is:

  - `standard`: a photo will be captured
  - `video`: a video will be captured
  - `motion`: a motion capture will be captured

  ```json
  {
    "steps": [
      "welcome",
      "document",
      {
        "type": "face",
        "options": {
          "requestedVariant": "motion"
        }
      },
      "complete"
    ]
  }
  ```

- **`showIntro {Boolean}` - optional**

  The instruction screen shown to the user at the beginning of the `face` capture step can be skipped for all variants. By default, the screen is shown (default to `true`).
  When disabled for the `standard` and `motion` variant, the entire intro screen will be removed from the flow.
  When disabled for the `video` variant, the example video will be hidden in the intro screen, only showing the text instructions.

- **`useMultipleSelfieCapture {Boolean}` - optional**

  This option only applies to the variant `standard`. By default the SDK will take additional selfie snapshots to help improve face similarity check accuracy. When disabled, only one selfie photo will be taken.

- **`recordMotionAudio {Boolean}` - optional**

  This option only applies to the variant `motion` and enables the recording of the user's background audio. By default this is option is set to `false`. If a user does not opt into granting microphone permissions, they cannot proceed with the Motion flow, and no video can be created or uploaded.

##### `face` fallback options

The SDK will try to fulfil the request depending on camera availability, device capabilities and browser support on the user's device:

- if the selected variant cannot be fulfilled and the user is on a desktop, the user will first be forwarded to the cross-device screen. This default step is introduced with version 14 of the Web SDK.
- if a video cannot be taken on the mobile device, the face step can be configured to fallback to the `standard` variant (see `photoCaptureFallback`)
- if Motion cannot be captured on the mobile device, an `unsupported` error will be thrown, which can be handled by `onError()`.

If the SDK is initialized with the `requestedVariant` option for the face step, make sure you use the data returned in the [`onComplete` callback](#handling-callbacks) to request the correct report when creating a check.

- **`photoCaptureFallback {Boolean}` - optional**

  This feature only applies to the [video](https://documentation.onfido.com/guide/facial-similarity-reports#video) variant.
  By default, this option is `true` and allows end-users to capture a selfie if their mobile browser does not support MediaRecorder (which is required by the other variants).
  When disabled, we will return an unsupported browser error if the end-user browser doesn’t support MediaRecorder.

#### `complete` step

This is the final completion step. The screen displays a completion message to signal the next steps to the user. This is an optional screen. The custom options are:

- `message` (string)
- `submessage` (string)

## Advanced callbacks

### Manual `onComplete` callback

In the context of non-workflow sessions, the `onComplete` callback returns additional information about the files uploaded by the user via the Onfido capture modules.

```javascript
Onfido.init({
	token: "<YOUR_SDK_TOKEN>",
	...
	onComplete: function (data) {
		console.log("everything is complete");
	},
});
```

The `data` object contains properties of the documents and face images uploaded by the user during the SDK session. The properties contain a unique identifier that can be used to retrieve the full document or face capture using the corresponding `document`, `live_photos` (for 'standard' selfies) or `live_videos` (for 'video' or 'motion' captures) endpoints defined in the [API reference](https://documentation.onfido.com/api/latest#retrieve-document).

```json
{
  "document": {
    "type": "driving_licence",
    "sides": {
      "front": {
        "id": "<DOCUMENT_ID_FRONT>"
      },
      "back": {
        "id": "<DOCUMENT_ID_BACK>"
      },
      "front_video": {
        "id": "<DOCUMENT_ID_FRONT_VIDEO>"
      },
      "back_video": {
        "id": "<DOCUMENT_ID_BACK_VIDEO>"
      }
    }
  },
  "face": {
    "id": "<FACE_ID>",
    "variant": "standard"
  },
  "poa": {
    "type": "utility_bill",
    "sides": {
      "front": {
        "id": "<POA_DOCUMENT_ID_FRONT>"
      },
      "back": {
        "id": "<POA_DOCUMENT_ID_BACK>"
      },
      "front_video": {
        "id": "<POA_DOCUMENT_ID_FRONT_VIDEO>"
      },
      "back_video": {
        "id": "<POA_DOCUMENT_ID_BACK_VIDEO>"
      }
    }
  }
}
```

For the `document` step, two-sided documents such as `driving_licence` and `national_identity_card`, the object will also contain a `document_back` property representing the reverse side.

For the face step, an object is returned with the `variant` used for the face capture,`'standard' | 'video' | 'motion'`.

For the `poa` step:

- `back` is only returned for two-sided documents
- the `_video` variants are defined for consistency but are not currently in use. `video` and standard variants are mutually exclusive.

### Custom media callbacks

<Callout>

> The following features must be enabled for your account before they can be used. For more information, please contact your Onfido Solution Engineer or Customer Success Manager.

</Callout>

Custom media callbacks enable you to control the data collected by the Onfido SDK by using callbacks that are invoked when the end user submits their captured media. The callbacks provide all of the information that would normally be sent directly to the Onfido API and expect a promise in response, that controls what the SDK does next.

Once custom media callbacks are enabled for your account, you will need to add the optional `enterpriseFeatures` object at the root of `Onfido.init()`, set `useCustomizedApiRequests` to `true` and define the callbacks for `onSubmitDocument`, `onSubmitVideo`, `onSubmitSelfie`.

```javascript
Onfido.init({
  ...
  enterpriseFeatures: {
    useCustomizedApiRequests: true,
    onSubmitDocument: (documentData) => {
      // Your callback code here
    },
    onSubmitSelfie: (selfieData) => {
      // Your callback code here
    },
    onSubmitVideo: (videoData) => {
      // Your callback code here
    },
  },
})
```

The callbacks return a `FormData` object, including the information that the SDK would send to Onfido. The callbacks are invoked when the end user confirms their image through the user interface.

**Note** that the data can also be returned in `json` format by adding the property `formatter: 'raw'` under the `enterpriseFeatures` object.

##### `onSubmitDocument` data parameter

```javascript
{
  file: blob,
  side: string,
  type: string,
  sdk_validations: object,
  sdk_source: string,
  sdk_version: string,
  sdk_metadata: object,
}
```

##### `onSubmitSelfie` data parameter

```javascript
{
  file: blob,
  snapshot: blob,
  sdk_source: string,
  sdk_version: string,
  sdk_metadata: object,
}

```

##### `onSubmitVideo` data parameter

```javascript
{
  file: blob,
  challenge:  { type: 'recite' / 'movement', query: number[] / string }
  challenge_id: string,
  challenge_switch_at: number, // seconds
  languages: { source: 'sdk', language_code: string }
  sdk_source: string,
  sdk_version: string,
  sdk_metadata: object,
}
```

#### Uploading the media files to Onfido

By default, this feature will prevent the request from being sent to Onfido, requiring you to [manually upload](https://documentation.onfido.com/api/latest#upload-document) the media files to Onfido from your backend for further processing.
We strongly recommend that you add all of the data provided to you through the callbacks in your request to the appropriate endpoint - `/documents` or `/live_photos`. Additionally, you should use the SDK token created for each applicant in the Authorization header of the request as shown below.

**Note** that the SDK token is not included in the FormData provided by the callbacks. You may want to append this, or a different unique identifier that is mapped to the applicant's SDK token, on your backend before sending it off.

```
Authorization: Bearer <SDK token here>
```

If you wish for the SDK to also upload the user-submitted data directly to Onfido you can resolve the promise with an object containing `continueWithOnfidoSubmission: true`.

```javascript
  onSubmitDocument: (data) => {
    // Your callback code here
    ...
    // Once your code has executed, resolve the promise
    return Promise.resolve({ continueWithOnfidoSubmission: true })
  }
```

#### Managing the Onfido response

Once you have sent the request to Onfido yourself, you can supply the SDK with the response so it can determine what the end user should be presented with.
In the case where a success response is received, the promise should be resolved with `onfidoSuccessResponse: <onfidoResponse>`. Otherwise reject the promise with the Onfido error response.
**Note**: An error response could be returned due to image quality issues. In this case, the SDK will present the end user with the appropriate error message.

```javascript
  onSubmitDocument: (data) => {
    // Send request to Onfido API /documents via your backend proxy
    .then(onfidoSuccessResponse =>
      Promise.resolve({ onfidoSuccessResponse: <onfidoResponse> }))
    .catch(onfidoError => Promise.reject(onfidoError))
  }
```

This is a sample openAPI YAML file you could use as an example to start your own proxy.

```yaml
openapi: 3.0.0
info:
  title: Network decouple back-end sample
  description: Network decouple back-end setup skeleton
  version: '1.0'
  contact: {}
tags: []
servers: []
components:
  schemas:
    IDocumentsRequest:
      type: object
      properties:
        file:
          type: string
          format: binary
          description: Uploaded document. Passed in from the web SDK callback.
        type:
          type: string
          default: passport
          description: >-
            The type of document that was submitted. Passed in from the web SDK
            callback.
        side:
          type: string
          default: front
          description: >-
            The type side of the document that was submitted. Passed in from the
            web SDK callback.
        sdk_metadata:
          type: object
          description: >-
            The metadata that web SDK collects. Forward this to Onfido API
            without modifications. Passed in from the web SDK callback.
        sdk_validations:
          type: object
          description: >-
            This is a an object used by web SDK to seek image quality feedback
            from the API. Forward this object without modifications to Onfido
            API. Passed in from the web SDK callback.
        sdk_source:
          type: string
          default: onfido_web_sdk
          description: >-
            The source of origin of the requests. Forward this without
            modifications to the Onfido API. Passed in from the web SDK callback.
        sdk_version:
          type: string
          description: >-
            The SDK version. Forward this without modifications to the Onfido
            API. Passed in from the web SDK callback.
    IMultiFrameSelfieRequest:
      type: object
      properties:
        file:
          type: string
          format: binary
          description: Uploaded photo
        sdk_metadata:
          type: object
          description: >-
            The metadata that web SDK collects. Forward this to Onfido API
            without modifications. Passed in from the web SDK callback.
        sdk_source:
          type: string
          default: onfido_web_sdk
          description: >-
            The source of origin of the requests. Forward this without
            modifications to the Onfido API. Passed in from the web SDK callback.
        sdk_version:
          type: string
          description: >-
            The SDK version. Forward this without modifications to the Onfido
            API. Passed in from the web SDK callback.
        snapshot:
          type: string
          format: binary
          description: Uploaded snapshot taken by the Web SDK to improve fraud analysis.
paths:
  /onfido/v3.3/documents:
    post:
      operationId: OnfidoController documents
      parameters:
        - name: Authorization
          in: header
          description: Customer back-end Authentication token
          schema:
            type: string
      requestBody:
        required: true
        description: The API endpoint to intercept the document upload from the Web SDK
        content:
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/IDocumentsRequest'
      responses:
        '200':
          description: >-
            The response received from Onfido v3.3/documents API call. The
            response format might slightly vary with the use case. Forward it
            without modifications as the callback response.
          content:
            application/json:
              schema:
                properties:
                  id:
                    type: string
                    format: uuid
                  created_at:
                    type: string
                    format: date-time
                  file_name:
                    type: string
                  file_size:
                    type: integer
                  file_type:
                    type: string
                  type:
                    type: string
                  side:
                    type: string
                  issuing_country:
                    type: string
                  applicant_id:
                    type: string
                  href:
                    type: string
                  download_href:
                    type: string
                  sdk_warnings:
                    type: object
        '201':
          description: ''
          content:
            application/json:
              schema:
                type: object
        '422':
          description: ''
          content:
            application/json:
              schema:
                properties:
                  error:
                    type: object
                    properties:
                      type:
                        type: string
                      message:
                        type: string
                  fields:
                    type: object
  /onfido/v3.6/live_photos:
    post:
      operationId: OnfidoController
      parameters:
        - name: Authorization
          in: header
          description: Customer back-end Authentication token
          schema:
            type: string
      requestBody:
        required: true
        description: The API endpoint to intercept the live photos upload from the Web SDK
        content:
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/IMultiFrameSelfieRequest'
      responses:
        '200':
          description: >-
            The response received from Onfido v3.6/live_photos API call. The
            response format might slightly vary with the use case. Forward it
            without modifications as the callback response.
          content:
            application/json:
              schema:
                properties:
                  id:
                    type: string
                    format: uuid
                  created_at:
                    type: string
                    format: date-time
                  file_name:
                    type: string
                  file_type:
                    type: string
                  file_size:
                    type: integer
                  href:
                    type: string
                  sdk_source:
                    type: string
                  sdk_version:
                    type: string
                  download_href:
                    type: string
        '201':
          description: ''
          content:
            application/json:
              schema:
                type: object
```

#### Custom media callbacks in cross-device flows

In the context of cross-device flows, you may choose to enable the media callbacks in either the desktop session or the mobile session.

A prerequisite is that you host the cross-device experience of the Onfido SDK yourself, as described in the [self-hosted cross-device URL](#self-hosted-cross-device-url) section of this document.

##### Enable custom media callbacks in mobile session

Once you have a server with the Onfido Web SDK installed and set up, you must initialize the mobile session with the callbacks and `useCustomizedApiRequests` options shown above.

```javascript
Onfido.init({
  ...
  enterpriseFeatures: {
    useCustomizedApiRequests: true,
    onSubmitDocument: (documentData) => {
      // Your callback code here
    },
    onSubmitSelfie: (selfieData) => {
      // Your callback code here
    },
    onSubmitVideo: (videoData) => {
      // Your callback code here
    },
  },
})
```

##### Enable custom media callbacks in desktop session

Media callbacks can also be triggered in the desktop session instead of the mobile session.
To do so, please contact your Onfido Solution Engineer or Customer Success Manager as additional configuration is required.

### Custom biometric token storage

When using Studio [authentication tasks](https://documentation.onfido.com/getting-started/onfido-studio-product/#authentication-tasks) with on-device storage, the SDK stores encrypted biometric tokens in the browser local storage. The SDK also allows clients to take control of the token lifecycle and exposes a callback to override the default implementation to read and write the token, so it can be stored on device, in cloud, in a keystore or on your infrastructure.

**Note:** Defining the callback will prevent the SDK from storing the encrypted biometric token.

**Note:** To store the encrypted biometric token in your infrastructure, it is recommended to [rely on webhooks](https://documentation.onfido.com/getting-started/onfido-studio-product/#authentication-on-customer-infrastructure) instead.

```typescript
Onfido.init({
	...
  onBiometricTokenGenerated: (customerUserHash: string, biometricToken: string): void => {
    // Called when a new biometric token is generated during enrollment.
    // Please ensure that customerUserHash to biometricToken relationship is 1:1
    await fetch("https://example.org/store", { method: "POST", body: { customerUserHash, biometricToken } })
  },
  onBiometricTokenRequested: async (customerUserHash: string): Promise<string> => {
    // Called when biometric token is requested during authentication
    const response = await fetch("https://example.org/retrieve?key=" + customerUserHash)
    return await token.text()
  }
});
```

### User analytics callbacks

The SDK allows you to track a user's journey through the verification process via a dispatched event. This gives insight into how your users make use of the SDK screens.
In order to track a user's progress through the SDK an `EventListener` must be added that listens for `userAnalyticsEvent` events. This can be done anywhere within your application.
The code inside of the `EventListener` callback will be invoked when an event is triggered.

```javascript
addEventListener('userAnalyticsEvent', (event) => /*Your code here*/);
```

The `event` parameter being passed in the callback contains the following information:

- `eventName {String}`: Name of the event triggered (full list below)
- `properties {Object}`: Event-specific properties
- `isCrossDevice {Boolean}`: Set to `true` when the event originates from a mobile session

| eventName                            |
| ------------------------------------ |
| WELCOME                              |
| USER_CONSENT                         |
| DOCUMENT_TYPE_SELECT                 |
| ID_DOCUMENT_COUNTRY_SELECT           |
| CROSS_DEVICE_INTRO                   |
| CROSS_DEVICE_GET_LINK                |
| CROSS_DEVICE_START                   |
| DOCUMENT_CAPTURE_FRONT               |
| DOCUMENT_CAPTURE_BACK                |
| DOCUMENT_CAPTURE_CONFIRMATION_FRONT  |
| DOCUMENT_CAPTURE_CONFIRMATION_BACK   |
| FACIAL_INTRO                         |
| FACIAL_CAPTURE                       |
| FACIAL_CAPTURE_CONFIRMATION          |
| VIDEO_FACIAL_INTRO                   |
| VIDEO_FACIAL_CAPTURE_STEP_1          |
| VIDEO_FACIAL_CAPTURE_STEP_2          |
| MOTION_FACIAL_INTRO                  |
| MOTION_FACIAL_ALIGNMENT              |
| MOTION_FACIAL_CAPTURE                |
| MOTION_FACIAL_NO_FACE_DETECTED       |
| MOTION_FACIAL_CAPTURE_ERROR_TIMEOUT  |
| MOTION_FACIAL_CAPTURE_ERROR_TOO_FAST |
| MOTION_FACIAL_UPLOAD                 |
| MOTION_FACIAL_UPLOAD_COMPLETED       |
| MOTION_FACIAL_CONNECTION_ERROR       |
| UPLOAD                               |

#### Version

You can access the sdk version through the handle once the SDK is loaded.

```javascript
const onfidoOut = Onfido.init({...})

onfidoOut.addEventListener('userAnalyticsEvent', (event) => {
  console.log('Version', onfidoOut.version)
});
```

### `onExternalLink` callback

When end users open a link to an external website or resource (such as a PDF file) during a verification flow in the Web SDK, the default behaviour is to open the link in a new browser tab.

To enable customers to tailor this behaviour to their specific needs when implementing the Web SDK in a webview or other custom integrations, the `onExternalLink` callback is provided to handle the opening of external links or the download of documents.

This feature is particularly useful for flows that integrate the Qualified Electronic Signature (QES) module, where buttons may redirect end users to external websites or allow PDF files to be viewed or downloaded.

The behaviour of the `onExternalLink` callback varies depending on the type of Web SDK integration:

- In a desktop integration, the `onExternalLink` callback is triggered when available (i.e., when a link is clicked)
- In a cross-device integration hosted by Onfido, the `onExternalLink` callback is not triggered on desktop as cross-device workflows always run in a browser environment where this functionality is inherently handled
- In a cross-device integration hosted by the customer (self-hosted), the `onExternalLink` callback is triggered when available (i.e., when a link is clicked)

Below you will find an example implementation of the `onExternalLink` callback.

```
Onfido.init({
 token: "<YOUR_SDK_TOKEN>",
 ...
 // The url is a string representing the external link
 onExternalLink: function (url) {
  console.log("Open the URL: ", url);
 },
});
```

## Self-hosted cross-device URL

<Callout>

> The following feature must be enabled for your account before it can be used. For more information, please contact your Onfido Solution Engineer or Customer Success Manager.

</Callout>

This feature allows you to specify your own custom or whitelabel url that the cross-device flow will redirect to instead of the Onfido default `id.onfido.com`. To use this feature, generate an SDK token as shown below and use it to start the SDK.

```bash
  $ curl https://api.onfido.com/v3/sdk_token \
  -H 'Authorization: Token token=YOUR_API_TOKEN' \
  -F 'applicant_id=YOUR_APPLICANT_ID' \
  -F 'referrer=REFERRER_PATTERN' \
  -F 'cross_device_url=YOUR_CUSTOM_URL'
```

In addition to this, you must either:

- Set up a server to forward the incoming HTTP request, including the path, to https://id.onfido.com

- Set up a server to host the Onfido Web SDK yourself at the provided URL

### Set up a server to forward the incoming HTTP request, including the path, to `https://id.onfido.com`

You can do this by setting up a server as a reverse proxy so that the URL that the end-user sees is your selected URL but the content shown is the Onfido-hosted Web SDK.
An example set-up for a minimal nginx server using docker:

nginx.conf

```nginx
server {
  # Change the next 2 lines as needed
  listen       80;
  server_name  localhost;

  location / {
    # This forwards the path to Onfido and is the only change
    # necessary when working with the default nginx configuration
    proxy_pass https://id.onfido.com;
  }
}
```

dockerfile

```docker
FROM nginx:1.15.8-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
```

### Set up a server to host the Onfido Web SDK yourself at the provided URL

This server must use the same version of the Onfido Web SDK and must initialize the SDK with `Onfido.init({ roomId: "<INSERT ROOM ID HERE>" })`. All other configuration options, except for callbacks provided for the `useCustomizedApiRequests` feature, will be provided by your original instance of the Onfido Web SDK.

Below is an example of how you could host the Onfido Web SDK with minimal setup. This `index.html` file starts the Onfido Web SDK using only the `js` and `css` files from the Onfido CDN (`https://sdk.onfido.com/<version>`).

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta
      charset="utf-8"
      name="viewport"
      content="width=device-width, initial-scale=1"
    />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="format-detection" content="telephone=no" />
    <title>Onfido Verification</title>
    <style type="text/css">
      html,
      body {
        height: 100%;
        margin: 0;
      }
      body,
      button {
        -webkit-font-smoothing: antialiased;
      }
      @media (min-width: 30em) {
        #onfido-mount {
          position: relative;
          top: 10%;
        }
        .onfido-sdk-ui-Modal-inner {
          font-family: 'Open Sans', sans-serif !important;
        }
      }
    </style>
    <!-- Important: You must use the same version as you are using on the desktop -->
    <script src="https://sdk.onfido.com/v14" charset="utf-8"></script>
  </head>

  <body>
    <div id="onfido-mount"></div>
    <script type="text/javascript">
      /*
        Get the roomId from the url (last 6 characters)
        Example:
        - https://example.com/XXCOXCKL -> roomId (COXCKL)
      */
      var roomId = window.location.pathname.substring(3, 9)

      Onfido.init({
        containerId: 'onfido-mount',
        roomId,
      })
    </script>
  </body>
</html>
```

## More information

### Supported browsers

| ![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png) |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Latest ✔                                                                                            | Latest ✔                                                                                               | Latest ✔                                                                                      | Latest ✔                                                                                            |

### Node.js supported versions

The SDK is compatible with the all supported Node.js versions (currently starting with Node.js 16).

### Accessibility

The Onfido SDK has been optimized to provide the following accessibility support by default:

- Screen reader support: accessible labels for textual and non-textual elements available to aid screen reader navigation, including dynamic alerts
- Keyboard navigation: all interactive elements are reachable using a keyboard
- Sufficient color contrast: default colors have been tested to meet the recommended level of contrast
- Sufficient touch target size: all interactive elements have been designed to meet the recommended touch target size

Refer to our [accessibility statement](https://documentation.onfido.com/sdk/sdk-accessibility-statement) for more details.

⚠️ Note: If you make your own UI customizations, you are responsible for ensuring that the UI changes will still adhere to accessibility standards. For example, accessible color contrast ratios and dyslexic friendly fonts.

### Troubleshooting

#### General Content Security Policy (CSP)

For guide on CSP common issue and recommendations, please refer to the guide [Onfido Web SDKn and Content Security Policy (CSP) guide](https://documentation.onfido.com/sdk/sdk-csp-guide).

#### Iframe integration

For instruction and guide on how to embed the Onfido Web SDK in an iFrame, please refer to the guide [Using the Onfido web SDK in an iFrame](https://documentation.onfido.com/sdk/sdk-iframe-guide).

#### Upload fallback

Onfido Web SDK versions <13.0.0 had a parameter named `uploadFallback` that could be set on both the document step and the face step. This parameter allowed clients to present end-users with a file input capability during the SDK flow.

With Web SDK 14.15 and above, the `uploadFallback` client-side parameter has been reintroduced.
To enhance the overall flow security, it is disabled by default and requires activation through the Onfido Support Team.

#### Permissions issues when using the Web SDK in a webview

For recommendations and code samples on how to embed the Onfido Web SDK in a webview, please refer to the guide [Using the Onfido web SDK in a webview](https://documentation.onfido.com/sdk/sdk-webview-guide).

### Support

Should you encounter any technical issues during integration, please contact Onfido's Customer Support team via [email](mailto:support@onfido.com), including the word ISSUE: at the start of the subject line.

Alternatively, you can search the support documentation available via the customer experience portal, [public.support.onfido.com](http://public.support.onfido.com).

We recommend you update your SDK to the latest version release as frequently as possible. Customers on newer versions of the Onfido SDK consistently see better performance across user onboarding and fraud mitigation, so we strongly advise keeping your SDK integration up-to-date.

You can review our full SDK versioning policy [here](https://documentation.onfido.com/sdk/sdk-version-releases).

### License Information

Please see [LICENSE](https://github.com/onfido/onfido-sdk-ui/blob/master/LICENSE) for licensing details.
