import Base from './BasePage.js'

class WelcomeScreen extends Base{
    getPrimaryBtn() { return this.$('.onfido-sdk-ui-Button-button'); }
}

export default WelcomeScreen;
