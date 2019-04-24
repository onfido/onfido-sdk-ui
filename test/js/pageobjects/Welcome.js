import Base from './BasePage.js'

class WelcomeScreen extends Base{
    getPrimaryBtn() { return this.$('.onfido-sdk-ui-Button-button'); }
    getWelcomeTitle() { return this.$('.onfido-sdk-ui-Title-titleSpan'); }
    getWelcomeSubtitle() { return this.$('.onfido-sdk-ui-Welcome-text'); }
    getPrimaryBtn() { return this.$('.onfido-sdk-ui-Button-button'); }
    getFooter() { return this.$('.onfido-sdk-ui-Theme-footer'); }
}

export default WelcomeScreen;
