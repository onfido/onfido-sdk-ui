import { h } from 'preact'
import theme from '../../Theme/style.css'
import style from './style.css'
import Title from '../../Title'
import {trackComponent} from '../../../Tracker'
import {preventDefaultOnClick} from '../../utils'
import {parseI18nWithXmlTags, localised} from '../../../locales'
import Graphic from './graphic';

const Guidance = ({translate, documentType, nextStep}) => {
  return (
    <div className={theme.fullHeightContainer}>
      <Title
        title={translate(`capture.${documentType}.front.title`)}
        subTitle={
          <span className={style.subTitle}>
            {parseI18nWithXmlTags(translate, `capture.${documentType}.front.sub_title`, ({ text }) => (
              <span className={style.bolder}>{text}</span>
            ))}
          </span>
        }
      />
      <div className={style.content}>
        <div className={style.makeSure}>{translate('proof_of_address.guidance.make_sure_it_shows')}</div>
        <div className={style.docImageContainer}>
          <Graphic />
        </div>
      </div>
      <div className={theme.thickWrapper}>
        <button
          className={`${theme.btn} ${theme['btn-primary']} ${theme['btn-centered']}`}
          onClick={preventDefaultOnClick(nextStep)}
        >
        {translate('proof_of_address.guidance.continue')}
        </button>
      </div>
    </div>
  )
}

export default trackComponent(localised(Guidance))
