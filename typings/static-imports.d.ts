declare module '*.scss' {
  const styles: { [className: string]: string }
  export default styles
}

declare module '*.svg' {
  const content: string
  export default content
}
