(function(window) {
  var parameters = new URLSearchParams(location.search);
  const name = 'link_id';

  if (parameters.has(name)) {
    window.onfido = Onfido.init({
      mobileFlow: true,
      containerId: 'root',
      roomId: parameters.get(name).replace(/^CV/, '')
    });
  }

  window.getToken = function() {

    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/token-factory/sdk_token', false);
      xhr.send();

      return JSON.parse(xhr.responseText).message;
    } catch (e) {
      return "error";
    }
  }
})(window);

