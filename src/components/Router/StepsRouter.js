import { h, Component } from 'preact'
import {sendScreen} from '../../Tracker'
import {wrapArray} from '../utils/array'
import NavigationBar from '../NavigationBar'
import Footer from '../Footer'
import theme from '../Theme/style.css'

class StepsRouter extends Component {
  constructor(props) {
    super(props)
  }

  trackScreen = (screenNameHierarchy, properties = {}) => {
    const { step } = this.currentComponent()
    sendScreen(
      [step.type, ...wrapArray(screenNameHierarchy)],
      {...properties, ...step.options})
  }

  currentComponent = () => this.props.componentsList[this.props.step]

  render = ({options: {...globalUserOptions}, ...otherProps}) => {
    const componentBlob = this.currentComponent()
    const CurrentComponent = componentBlob.component
    return (
      <div className={theme.step}>
        <NavigationBar back={this.props.back} i18n={this.props.i18n} disabled={this.props.disableBackNavigation}/>
        <div className={theme.content}>
          <CurrentComponent
            {...{...componentBlob.step.options, ...globalUserOptions, ...otherProps}}
            trackScreen = {this.trackScreen} />
        </div>
        <Footer />
      </div>
    )
  }
}

export default StepsRouter
