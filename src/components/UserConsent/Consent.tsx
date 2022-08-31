import { h } from 'preact'
import { useRef, useState } from 'preact/hooks'
import { Checkbox, HelperText, Icon } from '@onfido/castor-react'
import style from './Consent.scss'

export type ConsentProps = {
  consent: { title: string; template: string }
  defaultExpanded?: boolean
  defaultGranted?: boolean
  expandable?: boolean
  id: string
  onGrant: (grant: boolean) => void
  params: Map<string, string>
  invalid: boolean
}
export const Consent = ({
  consent: { title, template },
  defaultExpanded = false,
  defaultGranted = false,
  expandable = true,
  id,
  onGrant,
  params,
  invalid,
}: ConsentProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const granted = useRef(defaultGranted)

  const content = template.replaceAll(
    /{{([\S]*)}}/g,
    (_, key) => params.get(key) ?? ''
  )

  return (
    <div className={style.consent}>
      <div className={style.header}>
        <div className={style.title}>
          <Checkbox
            id={`${id}-grant`}
            data-testid={`${id}-grant`}
            className={style.input}
            invalid={invalid}
            defaultChecked={defaultGranted}
            onClick={() => {
              // With RTL, the event do not contain the target event
              granted.current = !granted.current
              onGrant(granted.current)
            }}
          >
            {title}
          </Checkbox>
        </div>
        {expandable && (
          <button
            aria-controls={`${id}-content`}
            aria-expanded={expanded}
            aria-label={'expand'}
            onClick={() => setExpanded(!expanded)}
          >
            <Icon
              aria-label={expanded ? 'chevron-up' : 'chevron-down'}
              name={expanded ? 'chevron-up' : 'chevron-down'}
            />
          </button>
        )}
      </div>
      {(expanded || !expandable) && (
        <HelperText
          className={style.content}
          role="region"
          id={`${id}-content`}
        >
          {content}
        </HelperText>
      )}
    </div>
  )
}
