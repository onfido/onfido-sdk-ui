import { h } from 'preact'
import QRCode from 'qrcode.react'

const QRCodeGenerator = ({ url, level = "Q", size = 100 }) =>
  <QRCode renderAs="svg" size={size} level={level} value={url} />

export default QRCodeGenerator
