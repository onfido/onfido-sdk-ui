import { h } from 'preact'
import { Input } from '@onfido/castor-react'
import { useEffect, useState } from 'preact/hooks'

export type SSNInputProps = {
  name?: string
  placeholder?: string
  style?: { [key: string]: string | number }
  value?: number | string
  maxLength?: number
  invalid?: boolean
  onChange?: (ev: { target: { value: string } }) => void
}

const isCharacterNumber = (char: string) => {
  return /^\d/.test(char)
}

const formatValueWithMask = (value: string) => {
  const currentValue = value.split('').filter(isCharacterNumber)
  return currentValue
    .reduce((newValue: string[], value: string, idx: number) => {
      if (idx === 3 || idx === 5) {
        return [...newValue, ...['-', value]]
      }

      return [...newValue, value]
    }, [])
    .join('')
}

const handleCopyText = () => {
  navigator.clipboard
    .readText()
    .then((text) => {
      const formattedCopiedText = text.replaceAll('-', '')
      navigator.clipboard.writeText(formattedCopiedText)
    })
    .catch((err) => {
      console.error('Failed to read clipboard contents: ', err)
    })
}

export const SSNInput = (props: SSNInputProps) => {
  const [formattedSSNValue, setFormattedSSNValue] = useState('')

  useEffect(() => {
    window.addEventListener('copy', handleCopyText)

    return () => {
      window.removeEventListener('copy', handleCopyText)
    }
  }, [])

  const handleOnInputValueChange = ({
    currentTarget: { value },
  }: {
    currentTarget: { value: string }
  }) => {
    const newValue = formatValueWithMask(value)
    setFormattedSSNValue(newValue)
  }

  const handleOnInputChange = ({
    target: { value },
  }: {
    target: { value: string }
  }) => {
    const newValue = formatValueWithMask(value)
    setFormattedSSNValue(newValue)
    props.onChange?.({ target: { value: newValue } })
  }

  return (
    <Input
      {...props}
      maxLength={11}
      onChange={handleOnInputChange}
      onInput={handleOnInputValueChange}
      placeholder={'999-99-9999'}
      type="text"
      value={formattedSSNValue}
    />
  )
}
