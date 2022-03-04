import { ComponentChild, h } from 'preact'
import QRCode, { BaseQRCodeProps } from 'qrcode.react'

type Props = {
  url: string
  level: BaseQRCodeProps['level']
  size: number
}

const QRCodeGenerator = ({
  url,
  level = 'Q',
  size = 100,
}: Props): ComponentChild => (
  <QRCode renderAs="svg" size={size} level={level} value={url} />
)

export default QRCodeGenerator
