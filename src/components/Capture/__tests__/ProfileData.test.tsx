// eslint-disable-next-line jest/no-mocks-import
import '../__mocks__/mockServer'
import '@testing-library/jest-dom'
import { h } from 'preact'
import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/preact'
import ProfileData, { ProfileDataProps } from '../ProfileData'
import MockedReduxProvider, {
  mockedReduxProps,
} from '~jest/MockedReduxProvider'
import { NarrowSdkOptions } from '~types/commons'
import { SdkOptionsProvider } from '~contexts/useSdkOptions'
import MockedLocalised from '~jest/MockedLocalised'
import userEvent from '@testing-library/user-event'
import { TextEncoder } from 'util'
import { wait } from '@testing-library/user-event/dist/utils'

global.TextEncoder = TextEncoder

const defaultConsents: { id: 'ssn' | 'mno'; url: string }[] = [
  {
    id: 'ssn',
    url: 'http://localhost:3000/ssn.json',
  },
  {
    id: 'mno',
    url: 'http://localhost:3000/mno.json',
  },
]

const defaultOptions: NarrowSdkOptions = {
  steps: [{ type: 'data' }],
}

const defaultProfileDataProps: ProfileDataProps = {
  ...mockedReduxProps,
  allowCrossDeviceFlow: false,
  back: jest.fn(),
  changeFlowTo: jest.fn(),
  completeStep: jest.fn(),
  componentsList: [],
  consents: [],
  dataFields: ['test_field_name'],
  dataSubPath: '',
  disabledFields: [],
  getPersonalData: jest.fn().mockReturnValue([]),
  nextStep: jest.fn(),
  parseTranslatedTags: jest.fn(),
  previousStep: jest.fn(),
  resetSdkFocus: jest.fn(),
  step: 0,
  steps: [],
  title: 'personal_information_title',
  trackScreen: jest.fn(),
  translate: jest.fn(),
  triggerOnError: jest.fn(),
}

const renderProfileData = async (consents = defaultConsents) => {
  render(
    <MockedReduxProvider>
      <SdkOptionsProvider options={defaultOptions}>
        <MockedLocalised>
          <ProfileData {...defaultProfileDataProps} consents={consents} />
        </MockedLocalised>
      </SdkOptionsProvider>
    </MockedReduxProvider>
  )

  await waitForElementToBeRemoved(screen.queryByRole('progressbar'))
  // Because we need to wait the useEffect to run during first rendering
  // And there is no visual item we can rely on
  await wait(100)
}

describe('ProfileData', () => {
  it('should display user consents, with ssn expanded', async () => {
    await renderProfileData()

    expect(screen.getByText('ssn title')).toBeInTheDocument()
    expect(screen.getByText('mno title')).toBeInTheDocument()

    expect(screen.getByText('ssn template')).toBeInTheDocument()
    expect(screen.queryByText('mno template')).not.toBeInTheDocument()
  })

  it('should not display error when landing in the form', async () => {
    await renderProfileData()
    expect(screen.queryByText(/required_consent/i)).not.toBeInTheDocument()
  })

  it('should display error when clicking on continue', async () => {
    await renderProfileData()
    await userEvent.click(screen.getByText(/button_continue/i))

    const errors = screen.getAllByText(/required_consent/i)
    expect(errors).toHaveLength(2)
    expect(errors[0]).toBeInTheDocument()
    expect(errors[1]).toBeInTheDocument()
  })

  it('should remove the error on granted consent', async () => {
    await renderProfileData()
    await userEvent.click(screen.getByText(/button_continue/i))

    await act(async () =>
      userEvent.click(screen.getByTestId('consent-ssn-grant'))
    )

    const errors = screen.getAllByText(/required_consent/i)
    expect(errors).toHaveLength(1)
    expect(errors[0]).toBeInTheDocument()
  })

  it('should display an error if cannot fetch the consent', async () => {
    await renderProfileData([
      // Returns HTTP 500
      { id: 'mno', url: 'http://localhost:3000/consent.json' },
    ])

    expect(await screen.findByText(/server error/i)).toBeInTheDocument()
  })
})
