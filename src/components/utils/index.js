import parseUnit from 'parse-unit'
import { h, Component } from 'preact'

export const functionalSwitch = (key, hash) => (hash[key] || (_=>null))()


export const getCSSValue = (expectedUnit, cssUnit) => {
  const [value, resUnit] = parseUnit(cssUnit)
  if (resUnit !== expectedUnit) {
    console.warn(`The css @value: ${cssUnit} unit is ${resUnit} but it should be ${expectedUnit}`)
  }
  return value
}
export const getCSSMilisecsValue = cssUnit => getCSSValue("ms", cssUnit)


export const wrapWithClass = (className, children) =>
  <div className={className}>{children}</div>

export const impurify = pureComponent => {
  const impureComponent = class extends Component {
    render = () => pureComponent(this.props)
  }
  impureComponent.defaultProps = pureComponent.defaultProps
  return impureComponent;
}
