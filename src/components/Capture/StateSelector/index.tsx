import { h } from 'preact'
import { Select, Option } from '@onfido/castor-react'
import { useLocales } from '~locales'
import { allStatesList } from './states'
import styles from './styles.scss'

export type StateSelectorProps = {
  name?: string
  value?: number | string
  invalid?: boolean
  onChange?: (ev: { target: { value: string } }) => void
}

export const StateSelector = (props: StateSelectorProps) => {
  const { translate } = useLocales()

  return (
    <div className={styles.stateSelector}>
      <Select {...props} native>
        <Option hidden value="">
          {translate('profile_data.components.state_select.placeholder')}
        </Option>
        {allStatesList.map(({ name, abbreviation }) => (
          <Option key={abbreviation} value={abbreviation}>
            {name}
          </Option>
        ))}
      </Select>
    </div>
  )
}
