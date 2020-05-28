import { h, Component } from 'preact'
import { localised } from '../../locales'
import { trackComponent } from '../../Tracker'
import theme from '../Theme/style.css'
// import style from './style.css'
import PageTitle from '../PageTitle'
import Button from '../Button'

class ImageQualityGuide extends Component<Props, State> {

  render() {
    const { translate, nextStep } = this.props
    return (
      <div className={theme.fullHeightContainer}>
        <PageTitle
          title={translate('capture.face.intro.title')}
          subTitle={translate('capture.face.intro.subtitle')}
        />
        <div>TODO: Passport Image Quality Guide (CX-5054)</div>
        <Button variants={['primary', 'centered']} onClick={nextStep}>
          {translate('continue')}
        </Button>
      </div>
    )
  }

}

export default trackComponent(localised(ImageQualityGuide), 'image_quality_guide')