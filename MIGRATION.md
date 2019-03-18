# Onfido JS SDK Migration Guide

These guides below are provided to ease the transition of existing applications using the Onfido SDK from one version to another that introduces breaking API changes.

## `3.1.0` -> `4.0.0`

### Import Breaking changes

We have changed how the sdk is exported, in order to reduce redundant transpiled code and to better trim dead code too. This led to a size reduction overall.

However, this has potentially created a breaking change for those consuming the SDK with an ES style of import. Classic window style import and commonjs require should work the same.

#### Example of old behaviour

```
import Onfido from 'onfido-sdk-ui'

Onfido.init(...)
```

#### Example of new behaviour
```
import {init} from 'onfido-sdk-ui'
init(...)
```

or

```
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
      onComplete: function(data) {
        // callback for when everything is complete
        console.log("everything is complete")
      }
    });
</script>

<body>
  <button id='onfido-btn'>Verify identity</button>
  <div id='onfido-mount'></div>
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
        onModalRequestClose: function() {
          // Update options with the state of the modal
          onfido.setOptions({isModalOpen: false})
        },
        token: 'YOUR_JWT_TOKEN',
        onComplete: function(data) {
          // callback for when everything is complete
          console.log("everything is complete")
        }
      });
    };
</script>

<body>
  <!-- Use a button to trigger the Onfido SDK  -->
  <button onClick="triggerOnfido()">Verify identity</button>
  <div id='onfido-mount'></div>
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
  onDocumentCapture: function(data) {
    /*callback for when the*/ console.log("document has been captured successfully", data)
  },
  onFaceCapture: function(data) {
    /*callback for when the*/ console.log("face capture was successful", data)
  },
  onComplete: function(capturesHash) {
    console.log("everything is complete")
    // data returned by the onComplete callback including the document and face files captured during the flow
    console.log(capturesHash)
    // function that used to return the document and face files captured during the flow.
    console.log(Onfido.getCaptures())
  }
})
```

### Example of new behaviour

```js
Onfido.init({
  // the JWT token that you generated earlier on
  token: 'YOUR_JWT_TOKEN',
  // id of the element you want to mount the component on
  containerId: 'onfido-mount',
  onComplete: function() {
    console.log("everything is complete")
    // You can now trigger your backend to start a new check
  }
})
```
