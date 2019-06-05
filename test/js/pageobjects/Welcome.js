import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class WelcomeScreen extends Base{
    getPrimaryBtn() { return this.$('.onfido-sdk-ui-Button-button'); }
    get welcomeTitle() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
    get welcomeSubtitle() { return this.$('.onfido-sdk-ui-Welcome-text')}
    get footer() { return this.$('.onfido-sdk-ui-Theme-footer')}
    get primaryBtn() { return this.$('.onfido-sdk-ui-Button-button')}
    
    copy(lang) {return locale(lang) }
    
    verifyTitle (copy) {
        const welcomeScreenStrings = copy.welcome
        verifyElementCopy(this.welcomeTitle, welcomeScreenStrings.title)
    }

    verifySubtitle() {
        const welcomeScreenStrings = this.copy(this.lang).welcome
        verifyElementCopy(this.welcomeSubtitle, welcomeScreenStrings.description_p_1 + "\n" + welcomeScreenStrings.description_p_2)
    }

    verifyIdentityButton() {
        const welcomeScreenStrings = this.copy(this.lang).welcome
        verifyElementCopy(this.primaryBtn, welcomeScreenStrings.next_button)
    }

    verifyFooter() {
        verifyElementCopy(this.footer)
    }
}

export default WelcomeScreen;
