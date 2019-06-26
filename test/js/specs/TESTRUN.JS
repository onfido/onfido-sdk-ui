const expect = require('chai').expect
import {describe, it} from '../utils/mochaw'
import { link } from 'fs';
const supportedLanguage = ["en", "es"]
const {By, Keys} = require('selenium-webdriver');


const options = {
  pageObjects: ['DocumentSelection', 'Welcome', 'DocumentUpload', 'DocumentUploadConfirmation', 'VerificationComplete', 'CrossDeviceIntro', 'CrossDevice', 'CrossDeviceCheckYourMobile']
}

const localhostUrl = 'https://localhost:8080/'

describe('Happy Paths', options, ({driver, pageObjects}) => {
  const {documentSelection, welcome, documentUpload, documentUploadConfirmation, verificationComplete, crossDeviceIntro, crossDevice, crossDeviceCheckYourMobile} = pageObjects

  describe('welcome screen', function () {

    const goToCrossDeviceScreen = async () => {
        welcome.primaryBtn.click()
        documentSelection.passportIcon.click()
        documentUpload.crossDeviceIcon.click()
        crossDeviceIntro.continueButton.click()
      }

      const waitForAlertToAppearAndSendSms = async () => {
        driver.sleep(1000)
        driver.switchTo().alert().accept()
        crossDevice.clickOnSendLinkButton()
        driver.sleep(1000)
      }

      const goToPassportUploadScreen = async (parameter='') => {
  
        driver.get(localhostUrl + parameter)
        welcome.primaryBtn.click()
        documentSelection.passportIcon.click()
    }

    const copyCrossDeviceLinkAndOpenInNewTab = async () => {
        const linkText = crossDevice.crossDeviceCopyLinkTextContainer.getText()
        driver.sleep(2000)

        driver.executeScript("window.open('your url','_blank');")
        driver.sleep(2000)

        driver.switchTo().window('Onfido SDK Demo');
    }

    const openNewTab = async () => {
        driver.wait(function () {
            return driver.getAllWindowHandles().then(function (handles) {
              var isHandleCount2 = (handles.length == 2);
              if (isHandleCount2) {
                driver.switchTo().window(handles[1]);
              }
              return isHandleCount2;
            });
          }).then(function () {
          // Now do some stuff in new tab
           
          });
    }

    const openNewBrowserTab = async () => {
        driver.sleep(2000)
        driver.executeScript("window.open('your url','_blank');")
        driver.sleep(2000)
    }

    const uploadFileAndClickConfirmButton = async (fileName) => {
        documentUpload.getUploadInput()
        documentUpload.upload(fileName)
        documentUploadConfirmation.confirmBtn.click()
      }

      const driverSwitchTabFocus = async () => {
        tabs =  [driver.getAllWindowHandles()]
        driver.switchTo().window(tabs.get(1));
        //driver.switchTo().window(tabs.get(0));
      }
    
    

      it('E2E flow with selfie upload', async () => {
        const crossDeviceCheckYourMobileCopy = crossDeviceCheckYourMobile.copy()

        goToPassportUploadScreen(`?async=false&useWebcam=false`)
        uploadFileAndClickConfirmButton('passport.jpg')
        documentUpload.crossDeviceIcon.click()
        crossDeviceIntro.continueButton.click()
        copyCrossDeviceLinkAndOpenInNewTab()
        driver.sleep(2000)
        // driverSwitchTabFocus()



        // crossDevice.crossDeviceSendLinkBtn.click()
        // waitForAlertToAppearAndSendSms()
        // crossDeviceCheckYourMobile.clickResendLink()
        // crossDevice.crossDeviceSendLinkBtn.click()
        // waitForAlertToAppearAndSendSms()
        // crossDeviceCheckYourMobile.verifyCrossDeviceCheckYourMobileTitle(crossDeviceCheckYourMobileCopy)
      })
        
    })
})

// Given I verify with passport with <locale>
//     When I click on cross_device_button ()
//     Then page_title should include translation for "cross_device.intro.document.title"
//     When I click on primary_button ()
//     Then page_title should include translation for "cross_device.link.title"
//     When I open cross_device_link () in a new tab
//     Then page_title should include translation for "capture.passport.front.title"
//     When I switch to tab 1
//     Then I wait until page_title has "cross_device.mobile_connected.title.message"
//     When I switch to tab 2
//     And I upload my document and selfie
//     Then page_title should include translation for "cross_device.client_success.title"
//     When I switch to tab 1
//     Then I wait for 1 second
//     Then page_title should include translation for "cross_device.submit.title"
//     When I click on primary_button ()
//     Then page_title should include translation for "complete.message"