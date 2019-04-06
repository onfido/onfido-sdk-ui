import Base from './BasePage.js'

class WelcomeScreen extends Base{
    get primaryBtn() { return this.$('.onfido-sdk-ui-Button-button'); }
}

export default WelcomeScreen;
