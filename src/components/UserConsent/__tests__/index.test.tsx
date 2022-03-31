import '@testing-library/jest-dom'
import { h } from 'preact'
import { sanitize } from 'dompurify'

import { SdkOptionsProvider } from '~contexts/useSdkOptions'
import { mockedReduxProps } from '~jest/MockedReduxProvider'
import UserConsent from '../index'

import type { NarrowSdkOptions } from '~types/commons'
import type { StepComponentBaseProps } from '~types/routers'
import { render, screen, configure } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'
import MockedLocalised from '~jest/MockedLocalised'
import { UserConsentContext } from '~contexts/useUserConsent'

configure({
  testIdAttribute: 'data-onfido-qa',
})

jest.mock('dompurify')

const xhrMock: Partial<XMLHttpRequest> = {
  open: jest.fn(),
  send: jest.fn(),
  setRequestHeader: jest.fn(),
  readyState: 4,
  status: 200,
  response: '<h1>My Sanitized Header</h1>',
}

jest
  .spyOn(window, 'XMLHttpRequest')
  .mockImplementation(() => xhrMock as XMLHttpRequest)

const defaultOptions: NarrowSdkOptions = {
  steps: [{ type: 'welcome' }, { type: 'userConsent' }],
}

const defaultProps: StepComponentBaseProps = {
  ...defaultOptions,
  ...mockedReduxProps,
  componentsList: [
    { component: UserConsent, step: { type: 'userConsent' }, stepIndex: 0 },
  ],
  allowCrossDeviceFlow: true,
  back: jest.fn(),
  changeFlowTo: jest.fn(),
  nextStep: jest.fn(),
  previousStep: jest.fn(),
  triggerOnError: jest.fn(),
  resetSdkFocus: jest.fn(),
  trackScreen: jest.fn(),
  step: 0,
}

const mockGrantConsents = jest.fn()

describe('UserConsent', () => {
  beforeEach(() => {
    const sanitizer = sanitize as jest.Mock
    sanitizer.mockReturnValueOnce(xhrMock.response)
    render(
      <SdkOptionsProvider options={defaultOptions}>
        <UserConsentContext.Provider
          value={{
            enabled: true,
            consents: [],
            grantConsents: () => Promise.resolve().then(mockGrantConsents),
          }}
        >
          <MockedLocalised>
            <UserConsent {...defaultProps} />
          </MockedLocalised>
        </UserConsentContext.Provider>
      </SdkOptionsProvider>
    )
  })

  it('renders UserConsent sanitized HTML', async () => {
    expect(await screen.findByText('My Sanitized Header')).toBeInTheDocument()
  })

  it('displays the decline dialog', () => {
    userEvent.click(screen.getByText(/user_consent.button_secondary/))
    expect(screen.getByRole('dialog')).toBeVisible()
  })

  it('updates applicant consents', async () => {
    userEvent.click(screen.getByText(/user_consent.button_primary/))
    expect(await screen.findByRole('progressbar')).toBeInTheDocument()
    expect(mockGrantConsents).toHaveBeenCalled()
  })
})
