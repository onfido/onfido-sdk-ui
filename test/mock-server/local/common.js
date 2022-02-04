(function(window) {
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

  var parameters = new URLSearchParams(location.search);
  var name = 'link_id';

  if (parameters.has(name)) {
    window.onfido = Onfido.init({
      mobileFlow: true,
      roomId: parameters.get(name).replace(/^\w{2}/, '')
    });
  }


})(window);

