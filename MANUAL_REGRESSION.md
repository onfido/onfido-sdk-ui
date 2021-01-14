# Manual Regression Tests for Web SDK

## Definitions

### `getUserMedia` supported browsers

Some testcases are only relevant on browsers that support getUserMedia.
To check if a device&browser supports getUserMedia you can check this link - [canIUse getUserMedia](https://caniuse.com/#search=getusermedia)

## Functional

### 1. Face photo webcam capture

(on private mode of: Google Chrome, Firefox, Safari and Microsoft Edge browsers)

Given webcam is connected to the computer

1. Go through the flow to face capture
   - browser should ask to enable the webcam
2. Accept the webcam to be used on browser
   - photo capture frame should display preview from webcam
3. Take photo with a webcam
   - confirmation screen should show up containing photo that was taken
   - user should be able to retake or continue with taken photo

### 2. Document photo webcam auto capture

(on private mode of: Google Chrome, Firefox, Safari and Microsoft Edge browsers)

Given webcam is connected to the computer

1. Open link with additional GET parameter `?useWebcam=true`
2. Go through the flow to document capture
   - browser should ask to enable the webcam
3. Accept the webcam to be used on browser
   - photo capture frame should display preview from webcam
4. Place document in front of camera so that it aligns the edges of document capture frame
   - document should be auto-captured
   - confirmation screen should show up containing a photo that was taken
   - user should be able to retake or continue with taken photo

### 3. Cross-device with QR code

(on private mode of one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers)

Given user is on Passport page

1. Click on `Continue on phone` button to start cross-device flow
   - user should see `Continue on your phone` screen
2. Click on `Get secure link` button
   - user should see a QR code below the `Scan the QR code with your phone` sub-title
   - user should also see `How to scan a QR code` help button below the QR code
3. Clicking on `How to scan a QR code` button should display help instructions
4. Using the mobile phone's Camera app, scan the QR code and open the link on the browser
5. Mobile browser should load link
   - user should see `Submit passport photo page` screen with `Take photo` button
   - user should be able to upload a document from a mobile device

### 4a. Cross-device with copied link

(on private mode of: Firefox, Safari, IE11 and Microsoft Edge browsers)

Given user is on Passport page

1. Click on `Continue on phone` button to start cross-device flow
   - user should see `Continue on your phone` screen
2. Click on `Get secure link` button
   - user should see options to either `Get link via SMS` or `Copy link`
3. Click on `Copy link` option
4. Click on `Copy` button to copy the link
5. Open new tab and paste the copied link
   - user should see `Submit passport photo page` as the title of the screen
   - user should be able to upload a document from a mobile device
6. Switch to the first tab
   - user should see `Connected to your mobile` screen
   - user should see an option to cancel
7. Switch to the second tab and complete uploading the document and photo
8. Switch to the first tab again
   - user should see `Great, that’s everything we need` screen
   - list of items uploaded should be displayed as
     - `Document uploaded`
     - `Selfie uploaded`
   - user should see the `Submit verification` button
9. Submit verification
   - user should see `Verification complete` screen

### 4b. Cross-device with copied link (with Face video)

(on private mode of: Google Chrome, Firefox browsers)

Given user is on Passport page and link is opened with additional GET parameter `?faceVideo=true`

1. Follow steps 1-6 of the test above (3a)
2. Switch to the second tab and complete uploading the document and face video challenges
3. Switch to the first tab again
   - user should see `Great, that’s everything we need` screen
   - list of items uploaded should be displayed as
     - `Document uploaded`
     - `Video uploaded`
   - user should see the `Submit verification` button
4. Submit verification
   - user should see `Verification complete` screen

### 5. Cross-device with SMS

(on one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers)

Given user is on upload document page on desktop browser

1. Click on `Continue on phone` button to start cross-device flow
   - user should see `Continue on your phone` screen
   - user should be able to continue to next screen and provide mobile number from any country
   - user should see the option to send SMS
   - user should see option to copy link
2. Type valid mobile number connected to mobile test device and click on `Send link` button
   - user should see `Check your mobile` screen
   - user should see option to resend link
   - user should receive SMS on a mobile device
     a. _Additional test:_ Double click on `Send link` button - subsequent steps should be same as above and not skip straight to `Complete` screen
3. Open link on mobile device (for each mobile browser)
   - user should see `Upload front of document` screen
   - user should be able to upload a document from a mobile device

### 6. Cross-device with SMS in Spanish

(on private mode of one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers)

Given user is

    1. using the Spanish SDK by opening the link with additional GET parameter `?language=es`
    2. Given user is on upload document page on desktop browser

1. Click on `Continuar en el teléfono` button to start cross-device flow
   - user should see `Continúe en su teléfono móvil` screen
   - user should be able to continue to next screen and have the options for SMS and copy link
2. Click on `Obtener link via mensage de texto` option button
   - user should be able to provide mobile number from any country
   - user should now see the options to switch to QR code or copy link at the bottom
3. Type valid mobile number connected to mobile test device and send
   - user should see `Controle su dispositivo móvil` screen
   - user should see option to resend link
   - user should receive SMS on a mobile device
   - the body of the SMS should be in Spanish
4. Open link on mobile device (for each mobile browser)
   - user should see that the SDK is in Spanish

### 7. Cross-device errors

(on private mode of yet another browser)

Given user is on first page of cross-device flow

1. **STAGING ONLY:** Type invalid US number (+1 234 567 8912) and click send
   - user should see `Something's gone wrong` error
   - user should persist on the same screen

### 8. Prevent opening cross-device URL on web browsers

(on private mode of: Google Chrome, Firefox, Safari and Microsoft Edge browsers)

Given user is on first page of cross-device flow

1. Click on the `Copy` button
2. Open a new tab of the browser
3. Paste the link
   - user should see `Something's gone wrong` message
   - user should see `You must open this link on a mobile device` message
   - user should see the icon with the phone, screen and the red cross

### 9. Cross device transition between browsers with different face video support

(on private mode of: Google Chrome, Firefox)

Given webcam is connected to the computer

1. Open link with additional GET parameter `?faceVideo=true`
2. Upload the ID documents in the browser
3. On the face video recording screen, wait for the `Check that it is connected and functional. You can also continue verification on your phone` message and select it
4. Open the cross device link on a mobile device that doesn't have media recorder API support (Chrome on iOS)
   - user should be taken to the selfie intro screen
5. Open the cross device link on a mobile device that has media recorder API support (Chrome on Android)
   - user should be taken to the face video intro screen

Given webcam is not connected to the computer

1. Open link with additional GET parameter `?faceVideo=true`
2. Upload the ID documents in the browser
3. Open the cross device link on a mobile device that doesn't have media recorder API support (Chrome on iOS)
   - user should be taken to the selfie intro screen
4. Open the cross device link on a mobile device that has media recorder API support (Chrome on Android)
   - user should be taken to the face video intro screen

### 10a. Check happy path flow for passports on other desktop browsers

(on private mode of: Safari, Firefox, IE11 and Microsoft Edge browsers)

Go through the flow looking for layout/usability inconsistencies between browsers:

1. Select `passport` document
   - everything should be displayed properly and layout should not be broken
2. Upload document
   - everything should be displayed properly and layout should not be broken
3. Upload face photo
   - everything should be displayed properly and layout should not be broken

### 10b. Check happy path flow for other document types on other desktop browsers

(on private mode of: Safari, Firefox, IE11 and Microsoft Edge browsers)

Go through the flow looking for layout/usability inconsistencies between browsers:

1. Select either `driver's license` or `identity card` document
   - everything should be displayed properly and layout should not be broken
2. Type "de" in the text input below `Search for country`
   - everything should be displayed properly and layout should not be broken
   - there should be a dropdown list with the following countries displayed in the dropdown options:
     - Bangladesh, Denmark, Russia Federation, Sweden for `driver's license`
     - Bangladesh, Russia Federation, Sweden for `identity card`
3. Select a country from the list
4. Click on `Submit document`
5. Upload document
   - everything should be displayed properly and layout should not be broken
6. Upload face photo
   - everything should be displayed properly and layout should not be broken

### 11a. Check happy path flow for passports on mobile browsers

(on private mode of: Android Google Chrome and iOS Safari browsers)

Go through the flow looking for layout/usability inconsistencies between browsers:

1. Select `passport` document
   - everything should be displayed properly and layout should not be broken
2. Upload document
   - everything should be displayed properly and layout should not be broken
3. Upload face photo
   - everything should be displayed properly and layout should not be broken

### 11b. Check happy path flow for other document types on other desktop browsers

(on private mode of: Safari, Firefox, IE11 and Microsoft Edge browsers)

Go through the flow looking for layout/usability inconsistencies between browsers:

1. Select either `driver's license` or `identity card` document
   - everything should be displayed properly and layout should not be broken
2. Type "de" in the text input below `Search for country`
   - everything should be displayed properly and layout should not be broken
   - there should be a dropdown list with at least 1 country displayed
3. Select a country from the list
4. Click on `Submit document`
5. Upload document
   - everything should be displayed properly and layout should not be broken
6. Upload face photo
   - everything should be displayed properly and layout should not be broken

### 12. Check the camera is mirroring

(ONLY ON browsers with getUserMedia support: on an iOS and Android device; a laptop with camera; desktop or laptop with a third-party USB camera)

1. Go to the face step
2. Move your face to the left
   - Make sure your face also moves to the left on camera feed (like looking at a mirror)

### 13. Check the camera is fullscreen on mobile devices/small screens

(ONLY ON browsers with getUserMedia support: on an iOS and Android device; a laptop with camera; desktop or laptop with a third-party USB camera)

1. Go to the face step. If on desktop resize the window to less than 480px width wise (if the browser let's you reduce that far)
2. The capture component should be fullscreen

### 14. Check camera button cannot be clicked until camera permission is granted

(ONLY ON browsers with getUserMedia support: on an iOS and Android device; a laptop with camera; desktop or laptop with a third-party USB camera)

1. On private mode of a browser that has getUserMedia support, go to the face step
2. User should see a browser notification asking to Allow or Block camera permission
   - Button should appear disabled (darkened out)
   - Click on the camera button
   - Nothing should happen, user does not proceed to next step
3. Click on browser notification to Allow camera permission
   - Button should become enabled (no longer darkened out)
   - Click on the camera button
   - User proceeds to next step with preview of photo taken

### 15. Check that custom strings can be passed

(on any browser)

1. Go to latest JSFiddle
2. Add the following options to the `Onfido.init` initialisation params:

```json
language: {
    locale: 'fr',
    phrases: {'welcome.title': 'Ouvrez votre nouveau compte bancaire'}
}
```

3. Then the title on the welcome screen should be 'Ouvrez votre nouveau compte bancaire'

### 16. Overriding strings for a supported language

(on any browser)

1. Go to latest JSFiddle
2. Add the following options to the `Onfido.init` initialisation params:

```json
language: {
    locale: 'es',
    phrases: {'welcome.title': 'A custom string'}
}
```

3. Then the title on the welcome screen should be 'A custom string'
4. All the other strings should be in Spanish

### 17. Overriding strings for a supported language on mobile

(on any browser)

1. Go to latest JSFiddle
2. Add the following options to the `Onfido.init` initialisation params:

```json
language: {
    locale: 'es',
    mobilePhrases: {'capture.passport.front.title': 'A custom string'}
}
```

3. Select passport on the document selector screen
4. Choose the cross device flow and send an SMS to your mobile
5. The SMS should be in Spanish
6. When you open the link on your mobile device, the title on the cross device client should be `A custom string`
7. All the other strings should be in Spanish

### 18. Upload a document in PDF format

_Feature is available on desktop browsers only._
(on Firefox, Safari, IE11 and Microsoft Edge browsers)

1. Go through the flow to document capture
2. Upload a document in PDF format
3. You should see a confirm screen with the following outcomes

Outcome:

- on Safari (and Chrome - this is automated) you should see a preview of the PDF
- on Firefox, IE11, Microsoft Edge and mobile browsers you should see an icon of a PDF

### 19. Overriding the document options

1. Go to latest JSFiddle
2. Add the following options to the initialisation params:

```json
{
  "steps": [
    "welcome",
    {
      "type": "document",
      "options": {
        "documentTypes": {
          "passport": true,
          "driving_licence": true
        }
      }
    },
    "face",
    "complete"
  ]
}
```

Outcome:

- On the document selection screen only "Passport" and "Driver's License" options should be visible.

### 20. Check permission priming screen displays when webcam is available and permission was not yet granted

(on Firefox, Safari and Microsoft Edge browsers)

1. Go through the flow to document capture
2. Upload a valid document
3. Click `Confirm`
4. You should see a permission priming screen
5. Click `Enable webcam`
6. You should see the capture screen and camera permissions prompt

### 21. Check permission priming screen does not display when webcam is available and permission was already granted

(on Chrome)

1. Go through the flow to document capture
2. Upload a valid document
3. Click `Confirm`
4. You should see the capture screen

### 22. Check permission denied / recovery screen displays when webcam is available and permission wasn't previously denied and is denied after prompt

(on Chrome)

1. Go through the flow to document capture
2. Upload a valid document
3. Click `Confirm`
4. You should see a permission priming screen
5. Click `Enable webcam`
6. You should see the capture screen and camera permissions prompt
7. Click `Block`
8. You should see the permission denied / recovery screen

### 23. Check permission denied / recovery screen displays when webcam is available and permission was previously denied

(on Firefox, Safari and Microsoft Edge browsers)

1. Go through the flow to document capture
2. Upload a valid document
3. Click `Confirm`
4. You should see a permission priming screen
5. Click `Enable webcam`
6. You should see the permission denied / recovery screen if the browser does not remember previous decision

### 24. Live face capture fallback on Desktop

(on private mode of: Google Chrome, Firefox, Safari and Microsoft Edge browsers)

Given webcam is connected to the computer

1. Go through the flow to face capture
   - browser should ask to enable the webcam
2. Accept the webcam to be used on browser
   - photo capture frame should display preview from webcam
3. Wait for 10 seconds
   - A warning should pop up with "Use your mobile" link
4. Click on "Use your mobile"
   - You should be able to continue on mobile

### 25. Live face capture fallback on mobile

(on private mode of getUsermedia supported browser: latest Google Chrome on Android and Safari on iOS11+)

1. Go through the flow to face capture
   - browser should ask to enable the camera
2. Accept the camera to be used on browser
   - photo capture frame should display preview from camera
3. Wait for 8 seconds
   - A warning should pop up asking if you are having problems with the camera
4. Click on "Try the basic camera mode instead"
   - You should be able to take a picture with your native camera

### 26. Face video on desktop with webcam

(on private mode of: Google Chrome and Firefox browsers)

Given webcam is connected to the computer

1. Open link with additional GET parameter `?faceVideo=true`
2. Go through the flow to face capture
3. You should see an intro screen with header "Let’s make sure nobody’s impersonating you"
   - Click "Continue"
   - browser should ask to enable the webcam
4. Accept the webcam to be used on browser
   - video capture frame should display preview from webcam
5. Take a video with a webcam
   - click on the camera button
   - follow the instructions on the screen
   - you should see 2 challenges
   - once completed, you should be able to see the video and to click on "Confirm"
   - you should see the complete screen

### 27. Face video on desktop with webcam

(on private mode of: Safari and Edge browsers - these browsers do not support video recording)

Given webcam is connected to the computer

1. Open link with additional GET parameter `?faceVideo=true`
2. Go through the flow to face capture
3. You should see a screen that guides you to use your mobile
   - Copy the link
   - Open the link in a new tab
4. You should see a file uploader to upload a selfie
   - Upload selfie
   - Confirm

### 28. Face video on desktop with no video support or no webcam

(on private mode of: any browser with no webcam OR Safari and Edge browsers)

Given there is no webcam connected to the computer

1. Open link with additional GET parameter `?faceVideo=true`
2. Go through the flow to face capture
3. You should see a screen that guides you to use your mobile - Input mobile number - Send SMS - Click on link on your mobile - Accept camera permissions
   On Android:
   4a. You should see a camera screen - You should be able to submit a video
   On iOS:
   4b. You should see a file uploader to upload a selfie - Upload selfie - Confirm

ADDITIONAL TEST (for scenario where integrator sets `requestedVariant: 'video'` with no other options set):

1. Go to latest JSFiddle
2. Add the following options to the `Onfido.init` initialisation params:

```json
{
  "steps": [
    "welcome",
    {
      "type": "face",
      "options": {
        "requestedVariant": "video"
      }
    },
    "complete"
  ]
}
```

3. Should see same flow as from steps 3-4 above

### 29. Custom SMS country code and flag

(on one of the desktop browsers)

Given there is no webcam connected to the computer

1. Open link with additional GET parameter `?countryCode=US`
2. Click on `Continue on phone` button to start cross-device flow
   - user should see `Continue on your phone` screen
   - user should be able to continue to next screen and provide mobile number from any country
   - user should see the option to send SMS
   - the SMS input flag should be the US flag

### 30. Custom SMS with invalid country code

(on one of the desktop browsers)

Given there is no webcam connected to the computer

1. Open link with additional GET parameter `?countryCode=ABCD`
2. Click on `Continue on phone` button to start cross-device flow
   - user should see `Continue on your phone` screen
   - user should be able to continue to next screen and provide mobile number from any country
   - user should see the option to send SMS
   - the SMS input flag should be the UK one

### 31. Prevent upload fallback when requested

Given user opened the link with `?uploadFallback=false` flag

1. And user is on first page of cross-device flow
2. Open the cross device link on mobile browsers with a working webcam
   - user should be able to complete the cross-device flow successfully

Given user opened the link with `?uploadFallback=false` flag

1. And user is on first page of cross-device flow
2. Open the cross device link on mobile browsers with a malfunctioning camera or on mobile browsers that do not support getUserMedia (i.e. Safari on iOS10.3 or earlier, Chrome on iOS)
   - user won't see the "use the native camera mode instead" link
   - user should see `Unsupported browser` message
   - user should see `Restart the process on the latest version of Safari/Chrome` message
   - user should NOT be able to complete the cross-device flow successfully.

Given user opened the link with `?uploadFallback=false` flag

1. And user is on first page of cross-device flow
2. Open the cross device link on mobile browser without a camera
   - user should not be able to upload documents
   - user should not be able to record the face video
   - user should see `Unsupported browser` message
   - user should see `Restart the process on the latest version of Safari/Chrome` message
   - user should see the icon with the phone, screen and the red cross

### 32. Custom SMS number

(on one of the desktop browsers)

1. Open link with additional GET parameter `?smsNumber=+447955555555`
2. Go to the document capture step
3. Click on `Continue on phone` button to start cross-device flow
   - user should see `Continue on your phone` screen
   - user should see that the SMS input has been pre-filled with the number provided at the beginning
   - if the number is correct the user should be able to successfully send an SMS
   - if the number is invalid the user will see an error when clicking "Send link"

### 33. Browse back after enlarging the document

(desktop and mobile browsers)

1. Upload a document
2. Click "Enlarge image"
3. Click browser's back button while document is zoomed in
   - "Check readability" text and back arrow retain the colour
   - Back navigation in the browser doesn't cause any other UI changes in the SDK

### 34a. Check happy path flow of live document capture on mobile devices with media recorder API support

(on private mode of both Android Chrome and Safari on iOS11+ mobile browsers)

1. Open link with additional GET parameter `?useLiveDocumentCapture=true`
2. Go through the document capture flow
   - browser should ask to allow camera access
3. Allow the device's camera to be used on the browser
   - photo capture frame should display preview from the device's back facing camera
4. Place document in front of camera so that it aligns the edges of document capture frame
5. Take photo of the document with the back facing camera
   - document should be captured
   - loading screen might be visible if taking a long time
   - confirmation screen should eventually show up containing photo that was taken
   - user should be able to retake or continue with that photo

### 34b. Live document capture fallback on mobile

(on private mode of Google Chrome on Android and Safari on iOS11+)

1. Open link with additional GET parameter `?useLiveDocumentCapture=true&uploadFallback=true`
2. Go through the flow to document capture
   - browser should ask to enable the camera
3. Accept the camera to be used on browser
   - photo capture frame should display preview from camera
4. Wait for 10 seconds
   - A warning should pop up asking if you are having problems with the camera
5. Click on "Try the basic camera mode instead"
   - You should be able to take a picture with your native camera

### 34c. Live document capture fallback on Hybrid

(private mode for browsers on Microsoft Surface or other hybrid device)

1. Open link with additional GET parameter `?useLiveDocumentCapture=true`
2. Go through the flow to document capture
   - browser should ask to enable the camera
3. Accept the camera to be used on browser
   - photo capture frame should display preview from camera
4. Wait for 10 seconds
   - A warning should pop up asking if you are having problems with the camera
5. Click on "continue verification on your phone"
   - You should be able to switch to the cross device flow and use a mobile device to capture a document

### 34d. Live document capture facingMode: {exact: "environment"} constraint

(private mode for mobile browsers, browsers on Ipad, and browsers on Microsoft Surface or other hybrid device)

1. Open link with additional GET parameter `?useLiveDocumentCapture=true`
2. Go through the flow to document capture
   - browser should ask to enable the camera
3. Accept the camera to be used on browser
   - photo capture frame should display preview from camera
   - camera should be rear/environment facing

### 34e. Live document capture attempt on non hybrid desktop

(private mode for desktop browsers, not on Surface or other hybrid device, OR if on hybrid device, with rear camera disabled through device manager)

1. Open link with additional GET parameter `?useLiveDocumentCapture=true`
2. Go through the flow to document capture
   - browser should disregard the request for live document capture
   - browser should direct to the normal desktop flow options of cross device or document upload

## Non-functional

### 1. Check analytics tracking

(on one browser)

With Web SDK project open in Woopra

1. Go through the normal flow for any document
   - all events should be tracked
   - no events should be duplicated
2. Now repeat the same for cross-device; go through the flow for any document
   - all events should be tracked
   - no events should be duplicated

### 2. NPM packages installation

Given local `.node_modules` folder is removed (not existing)

1. Run `npm install`
   - dependencies should be installed successfully

## Accessibility

##### 1. Dynamic font size on iOS devices

1. Before launching the TestApp, go to Settings - (some iOS versions - General) - Accessibility - Larger text/Display & Text Size
2. Turn ON `Larger Text` option
3. Set text size picker to the largest one
4. Open the test link on Chrome or Safari on mobile device
5. Make sure:
   - All the screens reflect the changes applied in the Settings
   - If the whole text is not visible, you should have the possibility to scroll through the screen and be able to read the whole text
   - None of the strings is cut off

##### 2. Dynamic font size on Android devices

1. Before launching the TestApp, go to Settings and find the option within the Accessibility section for Font size. Location of such settings varies across the device models.
2. Set text size picker to the largest one
3. Open the test link on Chrome mobile browser
4. Make sure:
   - All the screens reflect the changes applied in the Settings
   - If the whole text is not visible, you should have the possibility to scroll through the screen and be able to read the whole text
   - None of the strings is cut off

##### 3. Screen reader on iOS devices - VoiceOver

Quick guide how to use VoiceOver - https://youtu.be/qDm7GiKra28

1. Before launching the TestApp, go to Settings - (some iOS versions - General) - Accessibility - VoiceOver
2. Turn ON VoiceOver option
3. Open the test link on Chrome or Safari on mobile device
4. Make sure:
   - When you run the flow the first item VoiceOver will focus on screen heading
   - When you transition to the next screen, the the first item VoiceOver will focus on screen heading
   - You are able to swipe back and forward on any strings and buttons
   - The strings are read properly
   - Once VoiceOver hovers over the button it will ready “button” word at the end
   - After navigating to next screen, the screen heading is announced e.g “Choose your document” or “Select issuing country”
   - While capturing the document the capture warnings are announced e.g. Glare is detected
   - You can complete document+selfie and document+video flows with VoiceOver

##### 4. Screen reader on iOS devices - TalkBack

Quick guide how to use TalkBack - https://youtu.be/YJSWYLZD8EI

1. Before launching the TestApp, go to Settings and find the Accessibility section. Inside the the Accessibility section there should be TalkBack
2. Turn ON TalkBack
3. Launch the TestApp
4. Make sure:
   - When you run the flow the first item TalkBack will focus on screen heading
   - When you transition to the next screen, the the first item TalkBack will focus on screen heading
   - You are able to swipe back and forward on any strings and buttons
   - The strings are read properly
   - Once TalkBack hovers over the button it will ready “button” word at the end
   - After navigating to next screen, the screen is announced e.g “Choose your document” or “Select issuing country”
   - While capturing the document the capture warnings are announced e.g. Glare is detected
   - You can complete document+selfie and document+video flows with TalkBack
