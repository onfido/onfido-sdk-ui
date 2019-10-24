// WARN: use of this util and navigator.userAgent is highly discouraged unless absolutely necessary and for simple use cases
export const getMobileOSName = () => {
  console.warn("getMobileOSName - use of navigator.userAgent is highly discouraged unless absolutely necessary and only for simple use cases")
  const userAgent = navigator.userAgent
  if (/android/i.test(userAgent)) {
    return "Android"
  }
  if (/iPad|iPhone|iPod/i.test(userAgent)) {
    return "iOS"
  }
}
