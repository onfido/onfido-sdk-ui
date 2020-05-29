import { h, Component } from 'preact'
import classNames from 'classnames'
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
          <div className={style.imageQualityGuideRow}>
            <div className={style.documentExampleCol}>
              <div
                role="img"
                aria-label={translate('image_quality_guide.img_alt_text')}
                className={classNames(
                  style.documentExampleImg,
                  style.documentExampleImgCutoff
                )}
              />
              <div className={style.documentExampleLabel}>
                {translate('image_quality_guide.not_cut_off')}
              </div>
            </div>
            <div className={style.documentExampleCol}>
              <div
                role="img"
                aria-label={translate('image_quality_guide.img_alt_text')}
                className={classNames(
                  style.documentExampleImg,
                  style.documentExampleImgBlur
                )}
              />
              <div className={style.documentExampleLabel}>
                {translate('image_quality_guide.no_blur')}
              </div>
            </div>
          </div>
          <div className={style.imageQualityGuideRow}>
            <div className={style.documentExampleCol}>
              <div
                role="img"
                aria-label={translate('image_quality_guide.img_alt_text')}
                className={classNames(
                  style.documentExampleImg,
                  style.documentExampleImgGlare
                )}
              />
              <div className={style.documentExampleLabel}>
                {translate('image_quality_guide.no_glare')}
              </div>
            </div>
            <div className={style.documentExampleCol}>
              <div
                role="img"
                aria-label={translate('image_quality_guide.img_alt_text')}
                className={classNames(
                  style.documentExampleImg,
                  style.documentExampleImgGood
                )}
              />
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