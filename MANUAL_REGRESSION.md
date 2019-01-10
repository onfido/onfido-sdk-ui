# Manual Regression Tests for JS SDK

## Definitions

### `getUserMedia` supported browsers
Some testcases are only relevant on browsers that support getUserMedia.
To check if a device&browser supports getUserMedia you can check this link - [canIUse getUserMedia](https://caniuse.com/#search=getusermedia)

## Functional

##### 1. Face photo webcam capture
(on private mode of: Google Chrome, Firefox, Safari and Microsoft Edge browsers)

0. Given webcam is connected to the computer
1. Go through the flow to face capture
    - browser should ask to enable the webcam
2. Accept the webcam to be used on browser
    - photo capture frame should display preview from webcam
3. Take photo with a webcam
    - confirmation screen should show up containing photo that was taken
    - user should be able to retake or continue with taken photo

##### 2. Document photo webcam capture
(on private mode of: Google Chrome, Firefox, Safari and Microsoft Edge browsers)

0. Given webcam is connected to the computer
1. Open link with additional GET parameter `?useWebcam=true`
2. Go through the flow to document capture
    - browser should ask to enable the webcam
3. Accept the webcam to be used on browser
    - photo capture frame should display preview from webcam
4. Place document in front of camera so that it aligns the edges of document capture frame
    - document should be auto-captured
    - confirmation screen should show up containing a photo that was taken
    - user should be able to retake or continue with taken photo

##### 3. Cross-device with link
(on private mode of: Firefox, Safari, IE11 and Microsoft Edge browsers)

0. Given user is on Passport page
1. Click on link to start cross-device flow
    - user should see `Continue your verification on mobile` screen
    - user should see option to copy link
2. Open new tab and paste the link
    - user should see `Passport photo page` title of the screen
    - user should be able to upload a document from a mobile device
3. Switch to the first tab
    - user should see `Connected to your mobile` screen
    - user should see an option to cancel
4. Switch to the second tab and complete uploading the document and photo
5. Switch to the first tab again
    - user should see `Great, that’s everything we need` screen
    - user should see the `Submit Verification` button
6. Submit verification
    - user should see `Verification complete` screen

##### 4. Cross-device with SMS
(on one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers)

0. Given user is on upload document page on desktop browser
1. Click on link to start cross-device flow
    - user should see `Continue your verification on mobile` screen
    - user should be able to provide mobile number from any country
    - user should see the option to send SMS
    - user should see option to copy link
2. Type valid mobile number connected to mobile test device and send
    - user should see `Check your mobile` screen
    - user should see option to resend link
    - user should receive SMS on a mobile device
3. Open link on mobile device (for each mobile browser)
    - user should see `Upload front of document` screen
    - user should be able to upload a document from a mobile device

##### 5. Cross-device with SMS in Spanish
(on one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers)

0. Given user is using the Spanish SDK by opening the link with additional GET parameter `?language=es`
1. Given user is on upload document page on desktop browser
2. Click on link to start cross-device flow
    - user should see `Continúe la verificación en su dispositivo móvil` screen
    - user should be able to provide mobile number from any country
    - user should see the option to send SMS
    - user should see option to copy link
3. Type valid mobile number connected to mobile test device and send
    - user should see `Controle su dispositivo móvil` screen
    - user should see option to resend link
    - user should receive SMS on a mobile device
    - the body of the SMS should be in Spanish
4. Open link on mobile device (for each mobile browser)
    - user should see that the SDK is in Spanish

##### 6. Cross-device resend SMS
(on private mode of another browser)

0. Given user is on first page of cross-device flow
1. Type valid mobile number connected to mobile test device and send
    - user should see `Check your mobile` screen
    - user should see option to resend link
2. Click `Resend link`
    - user should see `Continue your verification on mobile` screen again
    - user should be able to provide mobile number again
    - user should see the option to send SMS

##### 7. Cross-device errors
(on private mode of yet another browser)

0. Given user is on first page of cross-device flow
1. Type invalid mobile number and click send
    - user should see an validation error
    - user should persist on the same screen
2. **STAGING ONLY:** Type invalid US number (+1 234 567 8912) and click send
    - user should see `Something's gone wrong` error
    - user should persist on the same screen

##### 8. Prevent to open cross-device URL on web browsers.
    (on private mode of: Google Chrome, Firefox, Safari and Microsoft Edge browsers)

0. Given user is on first page of cross-device flow
1. Click on the `Copy` button
2. Open a new tab of the browser
3. Paste the link
    - user should see `Something's gone wrong` message
    - user should see `You must open this link on a mobile device` message
    - user should see the icon with the phone, screen and the red cross

####  9. Cross device transition between browsers with different liveness support
(on private mode of: Google Chrome, Firefox)

0. Given webcam is connected to the computer
1. Open link with additional GET parameter `?liveness=true`
2. Upload the ID documents in the browser
3. On the liveness recording screen, wait for the `Use your mobile to continue face verification` message and select it
4. Open the cross device link on a mobile device that doesn't have media recorder api support (Chrome on iOS)
    - user should be taken to the selfie intro screen
6. Open the cross device link on a mobile device that has media recorder api support (Chrome on Android)
    - user should be taken to the liveness intro screen

0. Given webcam is not connected to the computer
1. Open link with additional GET parameter `?liveness=true`
2. Upload the ID documents in the browser
4. Open the cross device link on a mobile device that doesn't have media recorder api support (Chrome on iOS)
    - user should be taken to the selfie intro screen
6. Open the cross device link on a mobile device that has media recorder api support (Chrome on Android)
    - user should be taken to the liveness intro screen

##### 10. Check happy path flow on other desktop browsers
(on private mode of: Safari, Firefox, IE11 and Microsoft Edge browsers)

Go through the flow looking for layout/usability inconsistencies between browsers:
1. Select one of the documents
    - everything should be displayed properly and layout should not be broken
2. Upload document
    - everything should be displayed properly and layout should not be broken
3. Upload face photo
    - everything should be displayed properly and layout should not be broken

##### 11. Check happy path flow on mobile browsers
(on private mode of: Android Google Chrome and iOS Safari browsers)

Go through the flow looking for layout/usability inconsistencies between browsers:
1. Select one of the documents
    - everything should be displayed properly and layout should not be broken
2. Upload document
    - everything should be displayed properly and layout should not be broken
3. Upload face photo
    - everything should be displayed properly and layout should not be broken

##### 12. Check the camera is mirroring
(ONLY ON browsers with getUserMedia support: on an iOS and Android device; a laptop with camera; desktop or laptop with a third-party USB camera)
1. Go to the face step
2. Move your face to the left
    - Make sure your face also moves to the left on camera feed (like looking at a mirror)

##### 13. Check the camera is fullscreen on mobile devices/small screens
(ONLY ON browsers with getUserMedia support: on an iOS and Android device; a laptop with camera; desktop or laptop with a third-party USB camera)
1. Go to the face step. If on desktop resize the window to less than 480px width wise (if the browser let's you reduce that far)
2. The capture component should be fullscreen

##### 14. Check that custom strings can be passed
(on any browser)
0. Go to latest JsFiddle
1. Add the following options to the `Onfido.init` initialisation params:
  ```javascript
  language: {
    locale: 'fr',
    phrases: {'welcome.title': 'Ouvrez votre nouveau compte bancaire'}
  }
  ```
2. Then the title on the welcome screen should be 'Ouvrez votre nouveau compte bancaire'

##### 15. Overriding strings for a supported language
(on any browser)
0. Go to latest JsFiddle
1. Add the following options to the `Onfido.init` initialisation params:
  ```javascript
  language: {
    locale: 'es',
    phrases: {'welcome.title': 'A custom string'}
  }
  ```
2. Then the title on the welcome screen should be 'A custom string'
3. All the other strings should be in Spanish

##### 16. Overriding strings for a supported language on mobile
(on any browser)
0. Go to latest JsFiddle
1. Add the following options to the `Onfido.init` initialisation params:
  ```javascript
  language: {
    locale: 'es',
    mobilePhrases: {'capture.passport.front.title': 'A custom string'}
  }
  ```
2. Select passport on the document selector screen
3. Choose the cross device flow and send an SMS to your mobile
4. The SMS should be in Spanish
5. When you open the link on your mobile device, the title on the cross device client should be `A custom string`
6. All the other strings should be in Spanish

##### 17. Upload a document in PDF format
*Feature is available on desktop browsers only.*
(on Firefox, Safari, IE11 and Microsoft Edge browsers)

1. Go through the flow to document capture
2. Upload a document in PDF format
3. You should see a confirm screen with the following outcomes
Outcome:
- on Safari (and Chrome - this is automated) you should see a preview of the PDF
- on Firefox, IE11, Microsoft Edge and mobile browsers you should see an icon of a PDF

##### 18. Overriding the document options
0. Go to latest JsFiddle
1. Add the following options to the initialisation params:
  ```javascript
  {
    steps: [
      'welcome',
      {
        type:'document',
        options: {
          documentTypes: {
            passport: true,
            driving_licence: true
          }
        }
      },
      'face',
      'complete'
    ]
  }
  ```
Outcome:
- On the document selection screen only "Passport" and "Driver's License" options should be visible.

##### 19. Check permission priming screen displays when webcam is available and permission was not yet granted
(on Firefox, Safari and Microsoft Edge browsers)

1. Go through the flow to document capture
2. Upload a valid document
3. Click `Confirm`
4. You should see a permission priming screen
5. Click `Enable webcam`
6. You should see the capture screen and camera permissions prompt

##### 20. Check permission priming screen does not display when webcam is available and permission was already granted
(on Firefox, Safari and Microsoft Edge browsers)

1. Go through the flow to document capture
2. Upload a valid document
3. Click `Confirm`
4. You should see the capture screen

##### 21. Check permission denied / recovery screen displays when webcam is available and permission wasn't previously denied and is denied after prompt
(on Firefox, Safari and Microsoft Edge browsers)

1. Go through the flow to document capture
2. Upload a valid document
3. Click `Confirm`
4. You should see a permission priming screen
5. Click `Enable webcam`
6. You should see the capture screen and camera permissions prompt
7. Click `Block`
8. You should see the permission denied / recovery screen

##### 22. Check permission denied / recovery screen displays when webcam is available and permission was previously denied
(on Firefox, Safari and Microsoft Edge browsers)

1. Go through the flow to document capture
2. Upload a valid document
3. Click `Confirm`
4. You should see a permission priming screen
5. Click `Enable webcam`
6. You should see the permission denied / recovery screen if the browser does not remember previous decision

##### 23. Check an intro screen is displayed when entering the cross-device  flow
(on Firefox, Safari, IE11 and Microsoft Edge browsers)

1. Go through the flow to document capture
2. Click `Need to use your mobile to take photos?`
3. You should see the cross-device intro screen

##### 24. Check flow changes to cross device when no webcam available
(no webcam / webcam disabled)

1. Go through the flow to document capture
2. Upload a valid document
3. Click `Confirm`
4. You should see the cross-device intro screen

##### 25. Live capture fallback on Desktop
(on private mode of: Google Chrome, Firefox, Safari and Microsoft Edge browsers)

0. Given webcam is connected to the computer
1. Go through the flow to face capture
    - browser should ask to enable the webcam
2. Accept the webcam to be used on browser
    - photo capture frame should display preview from webcam
3. Wait for 10 seconds
    - A warning should pop up with "Use your mobile" link
4. Click on "Use your mobile"
    - You should be able to continue on mobile

##### 26. Live capture fallback on mobile
(Google Chrome on Android, getUsermedia supported browser, and Safari on iOS11+)

1. Go through the flow to face capture
    - browser should ask to enable the webcam
2. Accept the webcam to be used on browser
    - photo capture frame should display preview from webcam
3. Wait for 8 seconds
    - A warning should pop up asking if you are having problems with the webcam
4. Click on "Try the basic camera mode instead"
    - You should be able to take a picture with your native camera

##### 27. Face video on desktop with webcam
(on private mode of: Google Chrome and Firefox browsers)

0. Given webcam is connected to the computer
1. Open link with additional GET parameter `?liveness=true`
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

##### 28. Face video on desktop with webcam
(on private mode of: Safari and Edge browsers - these browsers do not support video recording)

0. Given webcam is connected to the computer
1. Open link with additional GET parameter `?liveness=true`
2. Go through the flow to face capture
3. You should see a screen that guides you to use your mobile
    - Copy the link
    - Open the link in a new tab
4. You should see a file uploader to upload a selfie
    - Upload selfie
    - Confirm

##### 29. Face video on desktop with no video support or no webcam
(on private mode of: any browser with no webcam OR Safari and Edge browsers)

0. Given there is no webcam connected to the computer
1. Open link with additional GET parameter `?liveness=true`
2. Go through the flow to face capture
3. You should see a screen that guides you to use your mobile
    - Input mobile number
    - Send SMS
    - Click on link on your mobile
    - Accept camera permissions
On Android:
4a. You should see a camera screen
    - You should be able to submit a video
On iOS:
4b. You should see a file uploader to upload a selfie
    - Upload selfie
    - Confirm

##### 30. Custom SMS country code and flag
(on one of the desktop browsers)

0. Given there is no webcam connected to the computer
1. Open link with additional GET parameter `?countryCode=US`
1. Click on link to start cross-device flow
    - user should see `Continue your verification on mobile` screen
    - user should be able to provide mobile number from any country
    - user should see the option to send SMS
    - the SMS input flag should be the US flag

##### 31. Custom SMS with invalid country code
(on one of the desktop browsers)

0. Given there is no webcam connected to the computer
1. Open link with additional GET parameter `?countryCode=ABCD`
1. Click on link to start cross-device flow
    - user should see `Continue your verification on mobile` screen
    - user should be able to provide mobile number from any country
    - user should see the option to send SMS
    - the SMS input flag should be the UK one

## Internal - functional
##### 1. Prevent upload fallback when requested

0. Given user opened the link with `?uploadFallback=false` flag
1. And user is on first page of cross-device flow
2. Open the cross device link on mobile browsers with a working webcam.
    - user should be able to complete the cross-device flow successfully.

0. Given user opened the link with `?uploadFallback=false` flag
1. And user is on first page of cross-device flow
2. Open the cross device link on mobile browsers with a malfunctioning webcam or on mobile browsers that do not support getUserMedia (ie Safari on iOS10.3 or earlier).
    - user won't see the "use the native camera mode instead" link
    - user should NOT be able to complete the cross-device flow successfully.

0. Given user opened the link with `?uploadFallback=false` flag
1. And user is on first page of cross-device flow
2. Open the cross device link on mobile browser without the camera.
    - user should be able to upload the documents from the device storage
    - user should not be able to record the liveness video
    - user should see `Something's gone wrong` message
    - user should see `You'll need to restart your verification on your computer` message
    - user should see the icon with the phone, screen and the red cross

## Non-functional

##### 1. Check analytics tracking
(on one browser)

0. Having JS SDK project open in Woopra
1. Go through the normal flow for any document
    - all events should be tracked
    - no events should be duplicated
2. Now repeat the same for cross-device; go through the flow for any document
    - all events should be tracked
    - no events should be duplicated

##### 2. NPM packages installation

0. Given local `.node_modules` folder is removed (not existing)
1. Run `npm install`
    - dependencies should be installed successfully
