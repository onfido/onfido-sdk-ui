import '@testing-library/jest-dom'
import { h } from 'preact'
import { render, screen } from '@testing-library/preact'
import {
  RestrictedDocumentSelection,
  RestrictedDocumentSelectionProps,
} from '../RestrictedDocumentSelection'
import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'

const defaultProps = {} as RestrictedDocumentSelectionProps

const renderRestrictedDocumentSelection = () =>
  render(
    <MockedReduxProvider>
      <MockedLocalised>
        <RestrictedDocumentSelection {...defaultProps} />
      </MockedLocalised>
    </MockedReduxProvider>
  )

describe('RestrictedDocumentSelection', () => {
  it('renders correct elements', () => {
    renderRestrictedDocumentSelection()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /restricted_document_selection.title/i
    )

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      /restricted_document_selection.subtitle/i
    )

    expect(
      screen.getByText(/restricted_document_selection.country/)
    ).toBeInTheDocument()
  })
})
