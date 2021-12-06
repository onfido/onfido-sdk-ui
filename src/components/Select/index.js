import PageTitle from '../PageTitle'
import { IdentityDocumentSelector } from '../DocumentSelector'
// import type { GroupType } from '../DocumentSelector/documentTypes'
import { trackComponent } from '../../Tracker'
import { localised } from '../../locales'

/* type Props = {
  country: string,
  nextStep: (void) => void,
  documentTypes?: Object,
  actions: Object,
} & LocalisedType */

const makeDocumentSelectorOfGroup = (group) => {
  const DocumentSelectorByGroup = (props) => {
    const { translate, country } = props
    const DocumentSelector = IdentityDocumentSelector

    return (
      <div>
        <PageTitle
          title={translate('doc_select.title', {
            country: !country || country === 'GBR' ? 'UK' : '',
          })}
          subTitle={translate('doc_select.subtitle')}
        />
        <DocumentSelector {...{ ...props, group }} />
      </div>
    )
  }

  return DocumentSelectorByGroup
}

export const SelectIdentityDocument = trackComponent(
  localised(makeDocumentSelectorOfGroup('identity')),
  'type_select'
)
