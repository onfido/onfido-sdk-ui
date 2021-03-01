export type UICustomizationOptions = {
  // Title Font
  fontFamilyTitle?: string
  fontSizeTitle?: string
  fontWeightTitle?: string | number
  colorContentTitle?: string

  // Subtitle Fonts
  fontFamilySubtitle?: string
  fontSizeSubtitle?: string
  fontWeightSubtitle?: string | number
  colorContentSubtitle?: string

  // Body Fonts
  fontFamilyBody?: string
  fontSizeBody?: string
  fontWeightBody?: string | number
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
  colorBorderDocTypeButton?: string
  colorBorderDocTypeButtonHover?: string
  colorBorderDocTypeButtonActive?: string
}
