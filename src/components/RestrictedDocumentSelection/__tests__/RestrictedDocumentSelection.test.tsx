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
      /doc_select.title/i
    )

    //expect(screen.getByTestId('countrySelector')).toBeInTheDocument()

    expect(
      screen.getByLabelText('doc_select.list_accessibility')
    ).toBeInTheDocument()
  })
})
