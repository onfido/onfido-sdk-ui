# Onfido Web SDK Migration Guide

The guides below are provided to ease the transition of existing applications using the Onfido SDK from one version to another that introduces breaking API changes.

## `6.1.0` -> `6.2.0`

### Changed strings

The **English**, **Spanish**, **German**, and **French** copy for the following string(s) has changed:

- `upload_guide.image_detail_blur_label`
- `upload_guide.image_detail_glare_label`
- `upload_guide.image_detail_good_label`

## `6.0.1` -> `6.1.0`

### Introduce `migrate_locales` script

From version `6.1.0`, Web SDK will use a new locale key naming convention that better supports scalability.
As a result, many key names will be changed and this might affect the integrator's custom locale options.
The `migrate_locales` script will help integrators migrate from the older key name convention
to the new one with minimal hassle.

To use the script:

- Upgrade `onfido-sdk-ui` package to latest version `6.1.0`
- Create a JSON file containing custom locales which was fed to `Onfido.init()` method. For instance:

  ```javascript
  // your-custom-language.json
  {
    "locale": "en_US",  // untouched keys
    "phrases": {        // required key
      "capture": {
        "driving_licence": {
          "front": {
            "instructions": "Driving license on web"
          }
        }
      },
      "complete.message": "Complete message on web"
    },
    "mobilePhrases": {  // optional key
      "capture.driving_licence.front.instructions": "Driving licence on mobile",
      "complete": {
        "message": "Complete message on mobile"
      }
    }
  }
  ```

- Consume the script directly from `node_modules/.bin`:

  ```shell
  $ migrate_locales --help                # to see the script's usage

  $ migrate_locales --list-versions       # to list all supported versions

  Supported versions:
    * from v0.0.1 to v1.0.0

  $ migrate_locales \
    --from-version v0.0.1 \
    --to-version v1.0.0 \
    --in-file your-custom-language.json \
    --out-file your-custom-language-migrated.json
  ```

- The migrated data should look like this:

  ```javascript
  // your-custom-language-migrated.json
  {
    "locale": "en_US",
    "phrases": {
      "new_screen": { // renamed key in nested object
        "driving_licence": {
          "front": {
            "instructions": "Driving license on web"
          }
        }
      },
      "screen_1.complete.message": "Complete message on web", // 2 generated keys from 1 old key
      "screen_2.complete.message": "Complete message on web"
      "mobilePhrases": { // force nesting because standalone `mobilePhrases` will be deprecated soon
        "new_screen.driving_licence.front.instructions": "Driving licence on mobile", // renamed key in dot notation
        "screen_1": { // 2 generated keys from 1 old key
          "complete": {
            "message": "Complete message on mobile"
          }
        },
        "screen_2": {
          "complete": {
            "message": "Complete message on mobile"
          }
        }
      }
    },
  }
  ```

- Notes: the script will preserve:

  - Order of the keys
  - Format: if your old keys are nested as an object, the migrated keys will be nested too. Otherwise,
    if your old keys are string with dot notation, the migrated keys will be string too.

## `5.10.0` -> `6.0.0`

### Change in UX flow for Document step

- Document step now has a Issuing Country Selection screen after the Document Type Selection screen. This screen is never displayed for **passport** documents and is disabled by default when only 1 document is preselected using the `documentTypes` option. This screen can still be included in the document capture flow of non-passport preselected documents by enabling the `showCountrySelection` option in the Document step configuration.

### Example of Document step with Country Selection for a preselected non-passport document

```json
{
  "steps": [
    "welcome",
    {
      "type": "document",
      "options": {
        "documentTypes": {
          "passport": false,
          "driving_licence": false,
          "national_identity_card": true
        },
        "showCountrySelection": true
      }
    },
    "complete"
  ]
}
```

### Example of Document step without Country Selection for a preselected non-passport document (default behaviour)

```json
{
  "steps": [
    "welcome",
    {
      "type": "document",
      "options": {
        "documentTypes": {
          "passport": false,
          "driving_licence": false,
          "national_identity_card": true
        },
        "showCountrySelection": false
      }
    },
    "complete"
  ]
}
```

### Example of Document step configurations with preselected documents where Country Selection will still be displayed

```json
{
  "steps": [
    "welcome",
    {
      "type": "document",
      "options": {
        "documentTypes": {
          "passport": true,
          "driving_licence": true,
          "national_identity_card": true
        }
      }
    },
    "complete"
  ]
}
```

```json
{
  "steps": [
    "welcome",
    {
      "type": "document",
      "options": {
        "documentTypes": {
          "passport": true,
          "national_identity_card": true,
          "driving_licence": false
        }
      }
    },
    "complete"
  ]
}
```

### Added strings

- `country_selection.error`
- `country_selection.dropdown_error`
- `country_selection.placeholder`
- `country_selection.search`
- `country_selection.submit`
- `country_selection.title`
- `capture.residence_permit.front.title`
- `capture.residence_permit.back.title`
- `confirm.residence_permit.message`
- `document_selector.identity.residence_permit_hint`
- `residence_permit`

### Changed strings

The **English**, **Spanish**, **German**, and **French** copy for the following string(s) has changed:

- `document_selector.identity.title`
- `document_selector.identity.hint`

### Changed keys

The following keys have been renamed:

- `errors.server_error.instruction` => `errors.request_error.instruction`
- `errors.server_error.message` => `errors.request_error.message`

### Removed strings

- `SMS_BODY`

## `5.7.0` -> `5.10.0`

### Added strings

- `image_quality_guide.title`
- `image_quality_guide.sub_title`
- `image_quality_guide.all_good`
- `image_quality_guide.not_cut_off`
- `image_quality_guide.no_glare`
- `image_quality_guide.no_blur`
- `image_quality_guide.image_alt_text`
- `image_quality_guide.next_step`
- `mobilePhrases.image_quality_guide.title`
- `mobilePhrases.image_quality_guide.next_step`

### Changed strings

The **English** copy for the following string(s) has changed:

- `errors.invalid_capture`

## `5.6.0` -> `5.7.0`

With release 5.7.0 there are breaking changes that will affect integrators with customised languages or UI copy.

### Added strings

- `capture.face.intro.title`
- `capture.face.intro.subtitle`
- `capture.face.intro.selfie_instruction`
- `capture.face.intro.glasses_instruction`
- `capture.face.intro.accessibility.selfie_capture_tips`

- `continue`

- `cross_device.intro.title`
- `cross_device.intro.sub_title`
- `cross_device.intro.description_li_1`
- `cross_device.intro.description_li_2`
- `cross_device.intro.description_li_3`
- `cross_device.intro.action`

- `cross_device.link.sms_sub_title`
- `cross_device.link.copy_link_sub_title`
- `cross_device.link.qr_code_sub_title`
- `cross_device.link.options_divider_label`
- `cross_device.link.sms_option`
- `cross_device.link.copy_link_option`
- `cross_device.link.qr_code_option`

- `cross_device.link.qr_code.help_label`
- `cross_device.link.qr_code.help_step_1`
- `cross_device.link.qr_code.help_step_2`

- `cross_device.link.copy_link.action`
- `cross_device.link.copy_link.success`

### Removed strings

- `cross_device.intro.document.title`
- `cross_device.intro.document.take_photos`
- `cross_device.intro.document.action`

- `cross_device.intro.face.title`
- `cross_device.intro.face.take_photos`
- `cross_device.intro.face.action`

- `cross_device.link.sub_title`
- `cross_device.link.link_copy.action`
- `cross_device.link.link_copy.success`

### Changed strings

The **English** and **Spanish** copy for the following string(s) has changed:

- `cross_device.link.copy_link_label`
- `cross_device.link.sms_label`

## `5.0.0` -> `5.6.0`

With release 5.6.0 there is a breaking change that will affect integrators with customised languages or UI copy.

**Note:** The string custom translation version scheme has changed, going forward if the strings translations change it will result in a MINOR version change, therefore you are responsible for testing your translated layout in case you are using custom translations or copy.

### Added strings

- `capture.switch_device`

### Removed strings

- `cross_device.switch_device.submessage`

### Changed strings

The **English** and **Spanish** copy for the following string(s) has changed:

- `capture.upload_file`
- `errors.invalid_size.message`
- `errors.invalid_size.instruction`

The **English** copy for the following string(s) has changed:

- `capture.driving_licence.front.title`
- `capture.driving_licence.back.title`
- `capture.national_identity_card.front.title`
- `capture.national_identity_card.back.title`
- `capture.passport.front.title`
- `capture.bank_building_society_statement.front.title`
- `capture.utility_bill.front.title`
- `capture.benefit_letters.front.title`
- `capture.council_tax.front.title`
- `errors.invalid_type.message`
- `errors.invalid_type.instruction`

## `4.0.0` -> `5.0.0`

We have changed the behaviour of the document step. If the document step is initialised with only one document type, the document selector screen will not be displayed. If your application relies on the document selector screen, even if you are picking only one document, you will have to implement that UI yourself.

## `3.1.0` -> `4.0.0`

### Import breaking changes

We have changed how the SDK is exported, in order to reduce redundant transpiled code and to better trim dead code too. This led to a size reduction overall.

However, this has potentially created a breaking change for those consuming the SDK with an ES style of import. Classic window style import and commonjs require should work the same.

#### Example of old behaviour

```js
import Onfido from 'onfido-sdk-ui'

Onfido.init(...)
```

#### Example of new behaviour

```js
import {init} from 'onfido-sdk-ui'
init(...)
```

or

```js
import * as Onfido from 'onfido-sdk-ui'
Onfido.init(...)
```

### Style Breaking change

- We have internally changed the CSS units used in the SDK to be relative (`em`) units.

Therefore, if you previously set the font-size of `.onfido-sdk-ui-Modal-inner`, it is recommended that you remove this `font-size` override.

This is because we are looking to make the SDK compatible with `em`, but first we need to remove media queries which are not really compatible with that unit.

#### Example of old behaviour

```css
.onfido-sdk-ui-Modal-inner {
  font-size: 20px;
}
```

#### Example of new behaviour

```css
.a-more-specific-selector {
  font-size: 20px;
}
```

## `2.8.0` -> `3.0.0`

### Breaking changes

- Removed support for `buttonId`. From this version you will need to create a function that launches the SDK when a trigger element (ie a button) is clicked.

### Example of old behaviour

```html
<script>
  Onfido.init({
    useModal: true,
    buttonId: 'onfido-btn',
    token: 'YOUR_JWT_TOKEN',
    onComplete: function (data) {
      // callback for when everything is complete
      console.log('everything is complete')
    },
  })
</script>

<body>
  <button id="onfido-btn">Verify identity</button>
  <div id="onfido-mount"></div>
</body>
```

### Example of new behaviour

```html
<script>
  var onfido = {}

  function triggerOnfido() {
    onfido = Onfido.init({
      useModal: true,
      isModalOpen: true,
      onModalRequestClose: function () {
        // Update options with the state of the modal
        onfido.setOptions({ isModalOpen: false })
      },
      token: 'YOUR_JWT_TOKEN',
      onComplete: function (data) {
        // callback for when everything is complete
        console.log('everything is complete')
      },
    })
  }
</script>

<body>
  <!-- Use a button to trigger the Onfido SDK  -->
  <button onClick="triggerOnfido()">Verify identity</button>
  <div id="onfido-mount"></div>
</body>
```

## `1.1.0` -> `2.0.0`

### Breaking changes

- Removed `onDocumentCapture` that used to be fired when the document had been successfully captured, confirmed by the user and uploaded to the Onfido API
- Removed `onFaceCapture` callbacks that used to be fired when the face has beed successfully captured, confirmed by the user and uploaded to the Onfido API.
- Removed `getCaptures` function that used to return the document and face files captured during the flow.
- Changed the behaviour of `onComplete` callback. It used to return an object that contained all captures, now it doesn't return any data.

### Example of old behaviour

```js
Onfido.init({
  token: 'YOUR_JWT_TOKEN',
  containerId: 'onfido-mount',
  onDocumentCapture: function (data) {
    /*callback for when the*/ console.log(
      'document has been captured successfully',
      data
    )
  },
  onFaceCapture: function (data) {
    /*callback for when the*/ console.log('face capture was successful', data)
  },
  onComplete: function (capturesHash) {
    console.log('everything is complete')
    // data returned by the onComplete callback including the document and face files captured during the flow
    console.log(capturesHash)
    // function that used to return the document and face files captured during the flow.
    console.log(Onfido.getCaptures())
  },
})
```

### Example of new behaviour

```js
Onfido.init({
  // the JWT token that you generated earlier on
  token: 'YOUR_JWT_TOKEN',
  // id of the element you want to mount the component on
  containerId: 'onfido-mount',
  onComplete: function () {
    console.log('everything is complete')
    // You can now trigger your backend to start a new check
  },
})
```
