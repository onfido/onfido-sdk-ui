export type UICustomisationOptions = {
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
  colorBorderDocTypeButton?: string
  colorBorderDocTypeButtonHover?: string
  colorBorderDocTypeButtonActive?: string

  // Back, Close (modal) Icon Button
  colorBackgroundButtonIconHover?: string
  colorBackgroundButtonIconActive?: string

  // Camera button
  colorBackgroundButtonCamera?: string
  colorBackgroundButtonCameraHover?: string
  colorBackgroundButtonCameraActive?: string
}
