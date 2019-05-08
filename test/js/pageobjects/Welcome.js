import Base from './BasePage.js'

class WelcomeScreen extends Base{
    getPrimaryBtn() { return this.$('.onfido-sdk-ui-Button-button'); }
    get welcomeTitle() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
    get welcomeSubtitle() { return this.$('.onfido-sdk-ui-Welcome-text')}
    get footer() { return this.$('.onfido-sdk-ui-Theme-footer')}
    get primaryBtn() { return this.$('.onfido-sdk-ui-Button-button')}
    get welcomeButtonString() { return string["welcome"]["next_button"]}
    get welcomeTitleString() { return string["welcome"]["title"]}
    get welcomeDescriptionP1String() { return string["welcome"]["description_p_1"]}
    get welcomeDescriptionP2String() { return string["welcome"]["description_p_2"]}
}

const locale = (lang="en") => require(`../../../src/locales/${lang}.json`)
const string = locale("en")
// const welcomeLocaleButton = copy["welcome"]["next_button"]

export default WelcomeScreen;
