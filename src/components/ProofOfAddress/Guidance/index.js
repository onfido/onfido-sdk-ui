import { h } from 'preact'
import PageTitle from '../../PageTitle'
import Button from '../../Button'
import { trackComponent } from '../../../Tracker'
import { localised } from '../../../locales'
import { POA_GUIDANCE_LOCALES_MAPPING } from '~utils/localesMapping'
import Graphic from './graphic'
import theme from '../../Theme/style.scss'
import style from './style.scss'

const Guidance = ({
  translate,
  parseTranslatedTags,
  poaDocumentType,
  nextStep,
}) => {
  if (!poaDocumentType) {
    return null
  }

  return (
    <div className={theme.fullHeightContainer}>
      <PageTitle
        title={translate(POA_GUIDANCE_LOCALES_MAPPING[poaDocumentType].title)}
        subTitle={
          <span className={style.subTitle}>
            {parseTranslatedTags(
              POA_GUIDANCE_LOCALES_MAPPING[poaDocumentType].subtitle,
              ({ text }) => (
                <span className={style.bolder}>{text}</span>
              )
            )}
          </span>
        }
      />
      <div className={style.content}>
        <div className={style.makeSure}>
          {translate('poa_guidance.instructions.label')}
        </div>
        <div className={style.docImageContainer}>
          <Graphic />
        </div>
      </div>
      <div className={theme.thickWrapper}>
        <Button variants={['primary', 'centered', 'lg']} onClick={nextStep}>
          {translate('poa_guidance.button_primary')}
        </Button>
      </div>
    </div>
  )
}

export default trackComponent(localised(Guidance))
