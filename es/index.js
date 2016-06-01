(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'preact', 'react-redux', 'onfido-sdk-core', './components/Modal', './components/app', 'object-assign'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('preact'), require('react-redux'), require('onfido-sdk-core'), require('./components/Modal'), require('./components/app'), require('object-assign'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.preact, global.reactRedux, global.onfidoSdkCore, global.Modal, global.app, global.objectAssign);
    global.index = mod.exports;
  }
})(this, function (module, exports, _preact, _reactRedux, _onfidoSdkCore, _Modal, _app, _objectAssign) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Modal2 = _interopRequireDefault(_Modal);

  var _app2 = _interopRequireDefault(_app);

  var _objectAssign2 = _interopRequireDefault(_objectAssign);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var Onfido = {};

  var defaults = {
    token: 'some token',
    buttonId: 'onfido-button',
    containerId: 'onfido-mount',
    onReady: null,
    onDocumentCapture: null,
    onFaceCapture: null,
    onComplete: null
  };

  Onfido.init = function (opts) {
    var options = (0, _objectAssign2.default)({}, defaults, opts);
    options.mount = document.getElementById(options.containerId);
    _Modal2.default.create(options);
    (0, _preact.render)((0, _preact.h)(
      _reactRedux.Provider,
      { store: _onfidoSdkCore.store },
      (0, _preact.h)(_app2.default, { options: options })
    ), options.mount);
  };

  Onfido.getCaptures = function () {
    return _onfidoSdkCore.events.getCaptures();
  };

  exports.default = Onfido;
  module.exports = exports['default'];
});