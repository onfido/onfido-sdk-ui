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

  window.request = function(method, url, sessionId, payload) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, false);
    xhr.setRequestHeader("X-Session-Id", sessionId)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(payload);
  }

  var parameters = new URLSearchParams(location.search);
  if (parameters.has('link_id')) {
    window.onfido = Onfido.init({
      mobileFlow: true,
      roomId: parameters.get('link_id').replace(/^\w{2}/, ''),
      containerId: "root"
    });
  }
})(window);
