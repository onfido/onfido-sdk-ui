import { h, Component } from 'preact'

export const functionalSwitch = (key, hash) => (hash[key] || (_=>null))()

export const impurify = pureComponent => {
  const impureComponent = class extends Component {
    render = () => pureComponent(this.props)
  }
  impureComponent.defaultProps = pureComponent.defaultProps
  return impureComponent;
}
