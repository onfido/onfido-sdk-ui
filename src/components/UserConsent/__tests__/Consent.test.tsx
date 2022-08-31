import '@testing-library/jest-dom'
import { h } from 'preact'
import { render, screen } from '@testing-library/preact'
import { Consent, ConsentProps } from '../Consent'
import userEvent from '@testing-library/user-event'

const consentJson = {
  title: 'Greetings consent',
  template: 'Hello {{name}} !',
}

const consentMap = new Map([['name', 'world']])

const renderConsent = (props?: Partial<ConsentProps>) => {
  render(
    //@ts-ignore
    <Consent
      id={'hello'}
      consent={consentJson}
      params={consentMap}
      invalid={false}
      {...props}
    />
  )
}

describe('Consent', () => {
  it('should display title and resolved template', () => {
    renderConsent({ defaultExpanded: true })
    expect(screen.getByText('Greetings consent')).toBeInTheDocument()
    expect(screen.getByRole('region')).toContainHTML('Hello world !')
  })

  it('should be collapsed according to default property', () => {
    renderConsent({ defaultExpanded: true })
    expect(screen.getByLabelText('expand')).toHaveAttribute(
      'aria-expanded',
      'true'
    )
  })

  it('should be checked according to default property', () => {
    renderConsent({ defaultGranted: true })
    expect(screen.getByText('Greetings consent')).toHaveAttribute(
      'defaultchecked',
      'true'
    )
  })

  it('can expand and collapse', async () => {
    renderConsent()
    const button = screen.getByLabelText('expand')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('calls onClick when consent checkbox is clicked', async () => {
    const onGrant = jest.fn()
    renderConsent({ onGrant })
    const checkbox = screen.getByText('Greetings consent')
    await userEvent.click(checkbox)
    expect(onGrant).toHaveBeenCalledWith(true)
  })
})
