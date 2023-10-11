# UI customization

The Web SDK supports customization options across the SDK screen including text, the SDK main container, buttons, links, icon background color and popups. For visualizations of the available options please see our [SDK customization guide](https://developers.onfido.com/guide/sdk-customization#web).

- **`customUI {Object} optional`**

  To customize the SDK, you can pass the corresponding CSS values to the `customUI` object for the following options:

  | Typography options     | Description                                                                        |
  | ---------------------- | ---------------------------------------------------------------------------------- |
  | `fontFamilyTitle`      | Change font family of the SDK screen titles                                        |
  | `fontFamilySubtitle`   | Change font family of the SDK screen subtitles                                     |
  | `fontFamilyBody`       | Change font family of the SDK screen content                                       |
  | `fontSizeTitle`        | Change font size of the SDK screen titles                                          |
  | `fontSizeSubtitle`     | Change font size of the SDK screen subtitles                                       |
  | `fontSizeBody`         | Change font size of the SDK screen content                                         |
  | `fontWeightTitle`      | Change font weight of the SDK screen titles (number format only, e.g. 400, 600)    |
  | `fontWeightSubtitle`   | Change font weight of the SDK screen subtitles (number format only, e.g. 400, 600) |
  | `fontWeightBody`       | Change font weight of the SDK screen content (number format only, e.g. 400, 600)   |
  | `colorContentTitle`    | Change text color of the SDK screen titles                                         |
  | `colorContentSubtitle` | Change text color of the SDK screen subtitles                                      |
  | `colorContentBody`     | Change text color of the SDK screen content                                        |

  Example configuration with typography options:

  ```javascript
  customUI: {
    "fontFamilyTitle": "Impact, fantasy",
    "fontSizeTitle": "26px",
    "fontWeightSubtitle": 600,
    "fontSizeSubtitle": "1.25rem",
  }
  ```

  ⚠️ **Note:** If you're using a scalable font size unit like em/rem, the SDK's base font size is 16px. This is currently not customizable.

  | Modal (SDK main container)    | Description                          |
  | ----------------------------- | ------------------------------------ |
  | `colorBackgroundSurfaceModal` | Change background color of SDK modal |
  | `colorBorderSurfaceModal`     | Change color of SDK modal border     |
  | `borderWidthSurfaceModal`     | Change border width of SDK modal     |
  | `borderStyleSurfaceModal`     | Change border style of SDK modal     |
  | `borderRadiusSurfaceModal`    | Change border radius of SDK modal    |

  Example configuration with Modal options:

  ```javascript
  customUI: {
      "colorBackgroundSurfaceModal": "#fafafa",
      "colorBorderSurfaceModal": "rgb(132 59 98)",
      "borderWidthSurfaceModal": "6px",
      "borderStyleSurfaceModal": "groove",
    }
  ```

  | Primary Buttons                      | Description                                            |
  | ------------------------------------ | ------------------------------------------------------ |
  | `colorContentButtonPrimaryText`      | Change color of Primary Button text                    |
  | `colorBackgroundButtonPrimary`       | Change background color of Primary Button              |
  | `colorBackgroundButtonPrimaryHover`  | Change background color of Primary Button on hover     |
  | `colorBackgroundButtonPrimaryActive` | Change background color of Primary Button on click/tap |
  | `colorBorderButtonPrimary`           | Change color of Primary Button border                  |
  | `colorBorderButtonPrimaryHover`      | Change color of Primary Button border on hover         |
  | `colorBorderButtonPrimaryActive`     | Change color of Primary Button border on click/tap     |

  | Secondary Buttons                      | Description                                              |
  | -------------------------------------- | -------------------------------------------------------- |
  | `colorContentButtonSecondaryText`      | Change color of Secondary Button text                    |
  | `colorBackgroundButtonSecondary`       | Change background color of Secondary Button              |
  | `colorBackgroundButtonSecondaryHover`  | Change background color of Secondary Button on hover     |
  | `colorBackgroundButtonSecondaryActive` | Change background color of Secondary Button on click/tap |
  | `colorBorderButtonSecondary`           | Change color of Secondary Button border                  |
  | `colorBorderButtonSecondaryHover`      | Change color of Secondary Button border on hover         |
  | `colorBorderButtonSecondaryActive`     | Change color of Secondary Button border on click/tap     |

  | Document Type Buttons                | Description                                                  |
  | ------------------------------------ | ------------------------------------------------------------ |
  | `colorContentDocTypeButton`          | Change Document Type Button text color                       |
  | `colorBackgroundDocTypeButton`       | Change background color of Document Type Button              |
  | `colorBackgroundDocTypeButtonHover`  | Change background color of Document Type Button on hover     |
  | `colorBackgroundDocTypeButtonActive` | Change background color of Document Type Button on click/tap |
  | `colorBorderDocTypeButton`           | Change color of Document Type Button border                  |
  | `colorBorderDocTypeButtonHover`      | Change color of Document Type Button border on hover         |
  | `colorBorderDocTypeButtonActive`     | Change color of Document Type Button border on click/tap     |

  | Selector                  | Description                      |
  | ------------------------- | -------------------------------- |
  | `colorBackgroundSelector` | Change Selector background color |

  | Icon options          | Description                                                         |
  | --------------------- | ------------------------------------------------------------------- |
  | `colorBackgroundIcon` | Change color of the background circle of pictogram icons in the SDK |
  | `colorIcon`           | Change color of the colored (blue) small icons                      |

  | Icon options        | Description                                         |
  | ------------------- | --------------------------------------------------- |
  | `colorInputOutline` | Change color of outline around certain input fields |

  Example configuration with Button options:

  ```javascript
  customUI: {
      "colorContentButtonPrimaryText": "#333",
      "colorBackgroundButtonPrimary": "#ffb997",
      "colorBorderButtonPrimary": "#B23A48",
      "colorBackgroundButtonPrimaryHover": "#F67E7D",
      "colorBackgroundButtonPrimaryActive": "#843b62",

      "colorContentButtonSecondaryText": "hsla(90deg 1% 31%)",
      "colorBackgroundButtonSecondary": "rgba(255 238 170 / 92%)",
      "colorBorderButtonSecondary": "coral",
      "colorBackgroundButtonSecondaryHover": "#ce6a85",
      "colorBackgroundButtonSecondaryActive": "#985277",
    }
  ```

  The following options are applied to multiple Button elements:

  | Shared Button options                   | Value Type | Description                                                                                                                                 |
  | --------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
  | `borderRadiusButton`                    | `string`   | Change border radius value of Primary, Secondary and Document Type Option buttons                                                           |
  | `buttonGroupStacked` (default: `false`) | `boolean`  | Display Primary, Secondary button group in Document and Face capture confirmation screens are in separate rows instead of inline by default |

  Example configuration:

  ```javascript
  customUI: {
      borderRadiusButton: "50px",
      buttonGroupStacked: true
    }
  ```

  | Links                       | Description                               |
  | --------------------------- | ----------------------------------------- |
  | `colorContentLinkTextHover` | Change Link text color on hover           |
  | `colorBorderLinkUnderline`  | Change Link underline color               |
  | `colorBackgroundLinkHover`  | Change Link background color on hover     |
  | `colorBackgroundLinkActive` | Change Link background color on click/tap |

  | Warning Popups                       | Description                                                |
  | ------------------------------------ | ---------------------------------------------------------- |
  | `colorContentAlertInfo`              | Change warning popup text color                            |
  | `colorBackgroundAlertInfo`           | Change warning popup background color                      |
  | `colorBackgroundAlertInfoLinkHover`  | Change warning popup fallback Link background on hover     |
  | `colorBackgroundAlertInfoLinkActive` | Change warning popup fallback Link background on click/tap |

  | Error Popups                       | Description                                              |
  | ---------------------------------- | -------------------------------------------------------- |
  | `colorContentAlertError`           | Change error popup text color                            |
  | `colorBackgroundAlertError`        | Change error popup background color                      |
  | `colorContentAlertErrorLinkHover`  | Change error popup fallback Link background on hover     |
  | `colorContentAlertErrorLinkActive` | Change error popup fallback Link background on click/tap |

  | Info Header/Highlight Pills | Description                                                                                      |
  | --------------------------- | ------------------------------------------------------------------------------------------------ |
  | `colorBackgroundInfoPill`   | Change background color of Cross Device, Camera/Mic Permissions screens' information header pill |
  | `colorContentInfoPill`      | Change text color of Cross Device, Camera/Mic Permissions screens' information header pill       |

  | Icon Buttons                      | Description                                                            |
  | --------------------------------- | ---------------------------------------------------------------------- |
  | `colorBackgroundButtonIconHover`  | Change background color of Back, Close Modal icon buttons on hover     |
  | `colorBackgroundButtonIconActive` | Change background color of Back, Close Modal icon buttons on click/tap |

  | Camera Shutter Button               | Description                                                                                 |
  | ----------------------------------- | ------------------------------------------------------------------------------------------- |
  | `colorBackgroundButtonCameraHover`  | Change background color of Live Selfie/Document Capture screens's Camera button on hover    |
  | `colorBackgroundButtonCameraActive` | Change background color of Live Selfie/Document Capture screen's Camera button on click/tap |

  | Cross-device            | Description                                                       |
  | ----------------------- | ----------------------------------------------------------------- |
  | `colorBackgroundQRCode` | Change background color of the QR code on the Cross device screen |
