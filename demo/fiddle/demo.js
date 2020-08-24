var url = 'https://token-factory.onfido.com/sdk_token'
var request = new XMLHttpRequest()
request.open('GET', url, true)
request.onload = function () {
  if (request.status >= 200 && request.status < 400) {
    var data = JSON.parse(request.responseText)

    Onfido.init({
      useModal: false,
      token: data.message,
      onComplete: function (data) {
        // callback for when everything is complete
        console.log('everything is complete')
      },
      steps: ['welcome', 'document', 'face', 'complete'],
    })
  }
}
request.send()
