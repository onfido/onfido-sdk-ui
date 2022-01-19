(() => {
  var parameters = new URLSearchParams(location.search);
  const name = 'link_id';

  if (parameters.has(name)) {
    window.onfido = Onfido.init({
      mobileFlow: true,
      containerId: 'root',
      roomId: parameters.get(name).replace(/^CV/, '')
    });
  }

  window.getToken = function(callback) {

    fetch('/token-factory/sdk_token')
      .then(response => response.json())
      .then(json => {
        callback(json.message)
      })
      .catch(error => {
        callback('error');
      });
  }
})();

