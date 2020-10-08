import { h } from 'preact'
import PageTitle from '../../PageTitle'
import Button from '../../Button'
import { trackComponent } from '../../../Tracker'
import { localised } from '../../../locales'
import Graphic from './graphic'
import theme from '../../Theme/style.scss'
import style from './style.scss'

const LOCALES_MAPPING = {
  bank_building_society_statement: {
    title: 'doc_submit.title_bank_statement',
    subtitle: 'poa_guidance.subtitle_bank_statement',
  },
  utility_bill: {
    title: 'doc_submit.title_bill',
    subtitle: 'poa_guidance.subtitle_bill',
  },
  council_tax: {
    title: 'doc_submit.title_tax_letter',
    subtitle: 'poa_guidance.subtitle_tax_letter',
  },
  benefit_letters: {
    title: 'doc_submit.title_benefits_letter',
    subtitle: 'poa_guidance.subtitle_benefits_letter',
  },
  government_letter: {
    title: 'doc_submit.title_government_letter',
    subtitle: 'poa_guidance.subtitle_government_letter',
  },
}

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
        title={translate(LOCALES_MAPPING[poaDocumentType].title)}
        subTitle={
          <span className={style.subTitle}>
            {parseTranslatedTags(
              LOCALES_MAPPING[poaDocumentType].subtitle,
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
