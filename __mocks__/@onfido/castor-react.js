export default jest.mock('@onfido/castor-react', () => {
  return {
    __esModule: true,
    button: () => {
      return <div>Mock Button</div>
    },
  }
})
