export type UICustomizationOptions = {
  // Modal (SDK Container)
  colorBackgroundSurfaceModal?: string
  colorBorderSurfaceModal?: string
  borderWidthSurfaceModal?: string
  borderStyleSurfaceModal?: string
  borderRadiusSurfaceModal?: string

  // Title Font
  fontFamilyTitle?: string
  fontSizeTitle?: string
  fontWeightTitle?: number
  colorContentTitle?: string

  // Subtitle Font
  fontFamilySubtitle?: string
  fontSizeSubtitle?: string
  fontWeightSubtitle?: number
  colorContentSubtitle?: string

  // Body Font
  fontFamilyBody?: string
  fontSizeBody?: string
  fontWeightBody?: number
  colorContentBody?: string

  // Primary Button
  colorContentButtonPrimaryText?: string
  colorBackgroundButtonPrimary?: string
  colorBackgroundButtonPrimaryHover?: string
  colorBackgroundButtonPrimaryActive?: string
  colorBorderButtonPrimary?: string

  // Secondary Button
  colorContentButtonSecondaryText?: string
  colorBackgroundButtonSecondary?: string
  colorBackgroundButtonSecondaryHover?: string
  colorBackgroundButtonSecondaryActive?: string
  colorBorderButtonSecondary?: string

  // Applied to both Primary, Secondary Buttons
  borderRadiusButton?: string

  // Displays Primary, Secondary Button groups as stacked blocks instead of inline on the same row
  buttonGroupStacked?: boolean

  // Document Type Option Button
  colorContentDocTypeButton?: string
  colorBackgroundDocTypeButton?: string
  colorBorderDocTypeButton?: string
  colorBorderDocTypeButtonHover?: string
  colorBorderDocTypeButtonActive?: string

  // Icon Background
  colorBackgroundIcon?: string

  // Link
  colorBorderLinkUnderline?: string
  colorContentLinkTextHover?: string
  colorBackgroundLinkHover?: string
  colorBackgroundLinkActive?: string

  // Warning Popup
  colorContentAlertInfo?: string
  colorBackgroundAlertInfo?: string
  colorBackgroundAlertInfoLinkHover?: string
  colorBackgroundAlertInfoLinkActive?: string

  // Error Popup
  colorContentAlertError?: string
  colorBackgroundAlertError?: string
  colorBackgroundAlertErrorLinkHover?: string
  colorBackgroundAlertErrorLinkActive?: string

  // Header/Highlight Pills
  colorBackgroundInfoPill?: string
  colorContentInfoPill?: string

  // Back, Close (modal) Icon Buttons
  colorBackgroundButtonIconHover?: string
  colorBackgroundButtonIconActive?: string

  // Camera Shutter Button (only customisable for hover, active states)
  colorBackgroundButtonCameraHover?: string
  colorBackgroundButtonCameraActive?: string

  // QR code background
  colorBackgroundQRCode?: string

  // Auth interface customization
  authAccentColor?: string
  authDualSpinnerColor?: string
  authRetryScreenOvalColor?: string
  authOvalColor?: string
  authTextColor?: string
  authButtonCornerRadius?: string
  authFrameColor?: string
  authButtonTextHighlightColor?: string
  authButtonTextDisabledColor?: string
  authButtonTextNormalColor?: string
  authButtonColorNormal?: string
  authButtonColorDisabled?: string
  authButtonColorPressed?: string
  authFeedbackBarColor?: string
  authFeedbackBarTextColor?: string
}
