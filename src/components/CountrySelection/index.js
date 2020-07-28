// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import classNames from 'classnames'
import PageTitle from '../PageTitle'
import Button from '../Button'
import { localised } from '../../locales'
import type { LocalisedType } from '../../locales'
import { trackComponent } from 'Tracker'
import theme from 'components/Theme/style.scss'
// import style from './style.scss'

type Props = {
  translate: (string, ?{}) => string,
  nextStep: () => void
} & LocalisedType

type State = {
  hasSelectedCountry: boolean
}

class CountrySelection extends Component<Props, State> {

  state: State = {
    hasSelectedCountry: false
  }

  render() {
    const { nextStep } = this.props
    return (
      <div className={theme.fullHeightContainer}>
        <PageTitle
          title={'Get title, subtitle from Lokalise'}
          subTitle={'Country list is based on document type (pre)selected'}
        />
        <div
          className={classNames(theme.thickWrapper, theme.scrollableContent)}
        >
          <p>TODO: country selector UI library, list from Docupedia export</p>
        </div>
        <div className={classNames(theme.thickWrapper)}>
          <Button
            variants={['centered', 'primary', 'lg']}
            disabled={!this.state.hasSelectedCountry}
            onClick={nextStep}
          >
            TODO: same as above
          </Button>
        </div>
      </div>
    )
  }

}

export default trackComponent(localised(CountrySelection))
