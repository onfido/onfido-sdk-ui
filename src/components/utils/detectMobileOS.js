// WARN: use of this util is highly discouraged unless absolutely necessary and for minor use cases
export const getMobileOSName = () => {
  const userAgent = navigator.userAgent
  if (/android/i.test(userAgent)) {
    return "Android"
  }
  if (/iPad|iPhone|iPod/i.test(userAgent)) {
    return "iOS"
  }
}
