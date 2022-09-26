import '@testing-library/jest-dom'
import { h } from 'preact'
import { render, screen } from '@testing-library/preact'
import {
  RestrictedDocumentSelection,
  RestrictedDocumentSelectionProps,
} from '../RestrictedDocumentSelection'
import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'

const defaultProps: Partial<RestrictedDocumentSelectionProps> = {
  trackScreen: jest.fn(),
  nextStep: jest.fn(),
}

const renderRestrictedDocumentSelection = () =>
  render(
    <MockedReduxProvider>
      <MockedLocalised>
        <RestrictedDocumentSelection
          {...(defaultProps as RestrictedDocumentSelectionProps)}
        />
      </MockedLocalised>
    </MockedReduxProvider>
  )

describe('RestrictedDocumentSelection', () => {
  it('renders correct elements', () => {
    renderRestrictedDocumentSelection()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /doc_select.title/i
    )

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      /doc_select.subtitle_country/i
    )

    expect(
      screen.getByText(/doc_select.section.header_country/i)
    ).toBeInTheDocument()
  })
})
