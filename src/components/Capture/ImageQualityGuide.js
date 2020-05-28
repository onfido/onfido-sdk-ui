import { h, Component } from 'preact'
import { localised } from '../../locales'
import { trackComponent } from '../../Tracker'
import theme from '../Theme/style.css'
import style from './style.css'
import PageTitle from '../PageTitle'
import Button from '../Button'

class ImageQualityGuide extends Component<Props, State> {

  render() {
    const { translate, nextStep } = this.props
    return (
      <div className={theme.fullHeightContainer}>
        <PageTitle
          title={translate('image_quality_guide.title')}
          subTitle={translate('image_quality_guide.sub_title')}
        />
        <div className={theme.thickWrapper}>
          <div className={style.imageQualityGuide}>
            <div className={style.documentExample}>
              <img
                className={style.documentExampleImg}
                src=""
                alt={translate('image_quality_guide.img_alt_text')} />
              <div className={style.documentExampleLabel}>
                {translate('image_quality_guide.not_cut_off')}
              </div>
            </div>
            <div className={style.documentExample}>
              <img
                className={style.documentExampleImg}
                src='assets/img-blur.svg'
                alt={translate('image_quality_guide.img_alt_text')} />
              <div className={style.documentExampleLabel}>
                {translate('image_quality_guide.no_blur')}
              </div>
            </div>
            <div className={style.documentExample}>
              <img
                className={style.documentExampleImg}
                src=""
                alt={translate('image_quality_guide.img_alt_text')} />
              <div className={style.documentExampleLabel}>
                {translate('image_quality_guide.no_glare')}
              </div>
            </div>
            <div className={style.documentExample}>
              <img
                className={style.documentExampleImg}
                src=""
                alt={translate('image_quality_guide.img_alt_text')} />
              <div className={style.documentExampleLabel}>
                {translate('image_quality_guide.all_good')}
              </div>
            </div>
          </div>
          <Button variants={['primary', 'centered']} onClick={nextStep}>
            {translate('image_quality_guide.next_step')}
          </Button>
        </div>
      </div>
    )
  }

}

export default trackComponent(localised(ImageQualityGuide), 'image_quality_guide')