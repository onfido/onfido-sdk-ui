import { h, FunctionComponent } from 'preact'
import { memo, useState } from 'preact/compat'
import { v4 as uuid4 } from 'uuid'

import type { ApplicantData } from './types'

type FieldProps = {
  hidden?: boolean
  label: string
  onChange: (value: string) => void
  value?: string
}

const Field: FunctionComponent<FieldProps> = ({
  hidden = false,
  label,
  onChange,
  value,
}) => {
  if (hidden) {
    return null
  }

  return (
    <div className="input-field">
      <label>{label}</label>
      <input
        type={label === 'Email' ? 'email' : 'text'}
        value={value}
        onChange={(event) => onChange((event.target as HTMLInputElement).value)}
      />
    </div>
  )
}

type Props = {
  onSubmit: (data: ApplicantData) => void
}

const appendUuidToEmail = (email: string): string | undefined => {
  if (!email.length) {
    return undefined
  }

  const [address, domain] = email.split('@')
  return [[address, uuid4()].join('_'), domain].join('@')
}

const ApplicantForm: FunctionComponent<Props> = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState('Web ANSSI')
  const [lastName, setLastName] = useState(
    `v${require('../../package.json').version}`
  )
  const [email, setEmail] = useState('')

  const handleSubmit = (event: Event) => {
    event.preventDefault()

    onSubmit({
      first_name: firstName.length ? firstName : undefined,
      last_name: lastName.length ? lastName : undefined,
      email: appendUuidToEmail(email),
    })
  }

  return (
    <div>
      <h1>Applicant data</h1>
      <form id="applicant-form" onSubmit={handleSubmit}>
        <Field
          label="First name"
          value={firstName}
          onChange={setFirstName}
          hidden
        />
        <Field
          label="Last name"
          value={lastName}
          onChange={setLastName}
          hidden
        />
        <Field label="Email" value={email} onChange={setEmail} />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default memo(ApplicantForm)
