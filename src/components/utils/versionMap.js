// We encode the version in the mobile link ID as a two digit base36 number.
// base36 goes: 0123456989ABCDEF...Z
// Ignore the patch number as patch releases are backwards compatible
export const versionToBase36 = {
  '1.1' : '00',
  'nextVersion': '01',
}
