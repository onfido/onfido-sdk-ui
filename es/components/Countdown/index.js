(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'preact'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('preact'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.preact);
    global.index = mod.exports;
  }
})(this, function (module, exports, _preact) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Countdown = function () {
    return (0, _preact.h)('span', { className: 'onfido-countdown' });
  };

  exports.default = Countdown;
  module.exports = exports['default'];
});