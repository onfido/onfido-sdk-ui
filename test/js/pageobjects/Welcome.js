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
        const welcomeTitleText = welcomeTitle.getText()
        expect(welcomeTitleText).to.equal(welcomeScreenStrings.title)
        welcomeTitle.isDisplayed()
    }

    verifySubtitle() {
        const welcomeScreenStrings = copy(lang).welcome
        const welcomeSubtitleText = welcome.welcomeSubtitle.getText()
        expect(welcomeSubtitleText).to.equal(welcomeScreenStrings.description_p_1 + "\n" + welcomeScreenStrings.description_p_2)
        welcomeSubtitle.isDisplayed()
    }

    verifyIdentityButton() {
        const verifyIdentityBtnText = primaryBtn.getText()
        expect(verifyIdentityBtnText).to.equal(welcomeScreenStrings.next_button)
        primaryBtn.isDisplayed()
    }

    verifyFooter() {
        footer.isDisplayed()
    }
}

export default WelcomeScreen;
