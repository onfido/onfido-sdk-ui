import Base from './BasePage.js'
import {locale} from '../utils/mochaw'

class WelcomeScreen extends Base{
    getPrimaryBtn() { return this.$('.onfido-sdk-ui-Button-button'); }
    get welcomeTitle() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
    get welcomeSubtitle() { return this.$('.onfido-sdk-ui-Welcome-text')}
    get footer() { return this.$('.onfido-sdk-ui-Theme-footer')}
    get primaryBtn() { return this.$('.onfido-sdk-ui-Button-button')}
    
    /* eslint-disable no-undef */
    copy(lang) { return locale(lang) }

    verifyTitle() {
        const welcomeScreenStrings = copy(lang).welcome
        verifyElementCopy(welcomeTitle, welcomeScreenStrings.title)
    }

    verifySubtitle() {
        const welcomeScreenStrings = copy(lang).welcome
        verifyElementCopy(welcomeSubtitle, welcomeScreenStrings.description_p_1 + "\n" + welcomeScreenStrings.description_p_2)
    }

    verifyIdentityButton() {
        const welcomeScreenStrings = copy(lang).welcome
        verifyElementCopy(primaryBtn, welcomeScreenStrings.next_button)
    }

    verifyFooter() {
        footer.isDisplayed()
    }
}

export default WelcomeScreen;
