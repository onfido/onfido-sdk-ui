export type EnterpriseCobranding = {
  text: string
}

export type EnterpriseLogoCobranding = {
  src: string
}

export type EnterpriseFeatures = {
  hideOnfidoLogo?: boolean
  cobrand?: EnterpriseCobranding
  logoCobrand?: EnterpriseLogoCobranding
}
