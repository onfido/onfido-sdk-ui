export const getMobileOSName = () => {
  const userAgent = navigator.userAgent
  if (/android/i.test(userAgent)) {
    return "Android"
  }
  if (/iPad|iPhone|iPod/i.test(userAgent)) {
    return "iOS"
  }
}
