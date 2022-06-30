// @ts-nocheck
export class ApiInterface {
  private services = {}

  constructor({ services }){
    this.services = services
  }

  dispatch = (data) => {
    Object.values(this.services || {}).forEach((services) => {
      let modifiedData = data
      
      ;(services || []).forEach((service) => {
        modifiedData = service.dispatch(data)
      })
    })
  }
}