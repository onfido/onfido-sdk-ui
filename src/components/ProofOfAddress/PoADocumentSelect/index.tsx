import { FunctionComponent, h } from 'preact'
import { trackComponent } from '../../../Tracker'
import { StepComponentBaseProps } from '~types/routers'
import PageTitle from '../../PageTitle'
import { useLocales } from '~locales'
import { poaDocumentOptions } from '../../DocumentSelector/documentTypes'
import { withDefaultOptions } from '../../DocumentSelector'

const DocumentSelector = withDefaultOptions(poaDocumentOptions)

type Props = {
  country?: string | undefined
} & StepComponentBaseProps

const PoADocumentSelector: FunctionComponent<Props> = (props) => {
  const { translate } = useLocales()
  const { country } = { ...props }

  return (
    <div>
      <PageTitle
        title={translate('doc_select.title_poa', {
          country: !country || country === 'GBR' ? 'UK' : '',
        })}
        subTitle={translate('doc_select.subtitle_poa')}
      />
      <DocumentSelector {...{ ...props, translate }} />
    </div>
  )
}

export default trackComponent(PoADocumentSelector, 'type_select')
